/**
 * Webhook Handler Worker
 * Processes webhook deliveries via BullMQ
 */
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const connection = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null
});

async function sendWebhook(url, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const client = isHttps ? https : http;

    const data = JSON.stringify(payload);

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'Form.io-Webhook/1.0',
        ...headers
      }
    };

    const req = client.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body
        });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const worker = new Worker(
  'webhooks',
  async job => {
    console.log(`Processing webhook: ${job.id}`);
    const { url, payload, headers, submissionId } = job.data;

    if (!url || !payload) {
      throw new Error('Missing required fields: url, payload');
    }

    const response = await sendWebhook(url, payload, headers);

    console.log(`Webhook delivered: ${response.statusCode} ${url}`);

    return {
      success: response.statusCode >= 200 && response.statusCode < 300,
      statusCode: response.statusCode,
      submissionId
    };
  },
  {
    connection,
    concurrency: parseInt(process.env.BULLMQ_WEBHOOK_CONCURRENCY || '5', 10),
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
);

worker.on('completed', (job, result) => {
  console.log(`Webhook ${job.id} completed: ${result.statusCode}`);
});

worker.on('failed', (job, err) => {
  console.error(`Webhook ${job.id} failed:`, err.message);
});

console.log('Webhook handler worker started');
console.log(`Concurrency: ${process.env.BULLMQ_WEBHOOK_CONCURRENCY || '5'}`);

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing worker...');
  await worker.close();
  await connection.quit();
  process.exit(0);
});
