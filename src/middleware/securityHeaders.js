'use strict';

/**
 * Security Headers Middleware
 * Implements OWASP security best practices:
 * - Content Security Policy (CSP)
 * - XSS Protection
 * - Clickjacking Prevention
 * - MIME Sniffing Prevention
 * - Referrer Policy
 */

module.exports = function(router) {
  return function securityHeaders(req, res, next) {
    // Content Security Policy - Prevents XSS attacks
    // Allow portal assets and Form.io CDN resources
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.form.io https://unpkg.com",
        "style-src 'self' 'unsafe-inline' https://cdn.form.io https://unpkg.com https://fonts.googleapis.com",
        "font-src 'self' https://cdn.form.io https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://cdn.form.io",
        "frame-ancestors 'self'",
        "form-action 'self'",
        "base-uri 'self'"
      ].join('; ')
    );

    // X-Content-Type-Options - Prevents MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // X-Frame-Options - Prevents clickjacking
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // X-XSS-Protection - Browser XSS filter (legacy browsers)
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer-Policy - Controls referrer information
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions-Policy - Controls browser features
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=()'
    );

    // Remove X-Powered-By header to hide Express
    res.removeHeader('X-Powered-By');

    next();
  };
};
