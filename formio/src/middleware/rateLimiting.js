'use strict';

/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and API abuse
 * Uses in-memory store (suitable for single-instance deployments)
 * For multi-instance deployments, use Redis store
 */

// Simple in-memory rate limiter
class RateLimiter {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map();

    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now - data.resetTime > this.windowMs) {
        this.requests.delete(key);
      }
    }
  }

  check(identifier) {
    const now = Date.now();
    const data = this.requests.get(identifier);

    if (!data || now - data.resetTime > this.windowMs) {
      // New window
      this.requests.set(identifier, {
        count: 1,
        resetTime: now
      });
      return {allowed: true, remaining: this.maxRequests - 1};
    }

    if (data.count >= this.maxRequests) {
      return {allowed: false, remaining: 0};
    }

    data.count++;
    return {allowed: true, remaining: this.maxRequests - data.count};
  }
}

module.exports = function(router) {
  // Different limits for different endpoints
  const limiters = {
    auth: new RateLimiter(15 * 60 * 1000, 5),     // 5 requests per 15 minutes for auth
    api: new RateLimiter(15 * 60 * 1000, 100),    // 100 requests per 15 minutes for API
    submission: new RateLimiter(60 * 1000, 10)     // 10 submissions per minute
  };

  return function rateLimiting(req, res, next) {
    // Skip rate limiting in test mode
    if (process.env.TEST_SUITE) {
      return next();
    }

    // Get client identifier (IP address + user agent)
    const identifier = `${req.ip || req.connection.remoteAddress}_${req.get('user-agent')}`;

    // Determine which limiter to use
    let limiter = limiters.api;
    if (req.path.includes('/auth/') || req.path.includes('/login') || req.path.includes('/register')) {
      limiter = limiters.auth;
    }
    else if (req.method === 'POST' && req.path.includes('/submission')) {
      limiter = limiters.submission;
    }

    const result = limiter.check(identifier);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', limiter.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);

    if (!result.allowed) {
      res.setHeader('Retry-After', Math.ceil(limiter.windowMs / 1000));
      return res.status(429).json({
        error: 'Too many requests, please try again later.',
        retryAfter: Math.ceil(limiter.windowMs / 1000)
      });
    }

    next();
  };
};
