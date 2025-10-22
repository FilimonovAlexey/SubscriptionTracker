import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { subscriptionRoutes } from './routes/subscriptions';
import { userRoutes } from './routes/users';
import { startBot } from './bot/bot';
import { startCronJobs } from './jobs/notification-cron';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Create Fastify instance
const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development' ? true : {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register plugins
async function registerPlugins() {
  // CORS
  await fastify.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  });

  // Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  await fastify.register(subscriptionRoutes, { prefix: '/api/subscriptions' });
  await fastify.register(userRoutes, { prefix: '/api/users' });
}

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  // Send error response
  reply.status(error.statusCode || 500).send({
    error: error.name || 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
    statusCode: error.statusCode || 500,
  });
});

// Not found handler
fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: 'Not Found',
    message: `Route ${request.method}:${request.url} not found`,
    statusCode: 404,
  });
});

// Start server
async function start() {
  try {
    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();

    // Start Fastify server
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server is running on http://${HOST}:${PORT}`);

    // Start Telegram bot
    await startBot();

    // Start cron jobs
    startCronJobs();

    console.log('✅ All systems operational');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal} received, closing server...`);
    await fastify.close();
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
start();
