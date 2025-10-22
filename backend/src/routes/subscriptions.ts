import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../services/prisma';
import { telegramAuthMiddleware } from '../middleware/telegram-auth';

// Validation schemas
const createSubscriptionSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  currency: z.enum(['USD', 'RUB']),
  billingCycle: z.enum(['monthly', 'yearly']),
  nextBillingDate: z.string().datetime(),
  category: z.string().max(50).optional(),
  icon: z.string().max(10).optional(),
  color: z.string().max(7).optional(),
});

const updateSubscriptionSchema = createSubscriptionSchema.partial();

const subscriptionIdSchema = z.object({
  id: z.string().uuid(),
});

export async function subscriptionRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('onRequest', telegramAuthMiddleware);

  // GET /api/subscriptions - Get all user subscriptions
  fastify.get('/', async (request, reply) => {
    const user = request.user!;

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: {
        nextBillingDate: 'asc',
      },
    });

    return { subscriptions };
  });

  // GET /api/subscriptions/:id - Get single subscription
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const user = request.user!;
    const { id } = subscriptionIdSchema.parse(request.params);

    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!subscription) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Subscription not found',
      });
    }

    return { subscription };
  });

  // POST /api/subscriptions - Create new subscription
  fastify.post('/', async (request, reply) => {
    const user = request.user!;

    try {
      const data = createSubscriptionSchema.parse(request.body);

      const subscription = await prisma.subscription.create({
        data: {
          ...data,
          userId: user.id,
        },
      });

      return reply.code(201).send({ subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation Error',
          message: error.errors,
        });
      }
      throw error;
    }
  });

  // PATCH /api/subscriptions/:id - Update subscription
  fastify.patch<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const user = request.user!;

    try {
      const { id } = subscriptionIdSchema.parse(request.params);
      const data = updateSubscriptionSchema.parse(request.body);

      // Check if subscription exists and belongs to user
      const existing = await prisma.subscription.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!existing) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Subscription not found',
        });
      }

      const subscription = await prisma.subscription.update({
        where: { id },
        data,
      });

      return { subscription };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation Error',
          message: error.errors,
        });
      }
      throw error;
    }
  });

  // DELETE /api/subscriptions/:id - Delete subscription (soft delete)
  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const user = request.user!;
    const { id } = subscriptionIdSchema.parse(request.params);

    // Check if subscription exists and belongs to user
    const existing = await prisma.subscription.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existing) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Subscription not found',
      });
    }

    // Soft delete
    await prisma.subscription.update({
      where: { id },
      data: { isActive: false },
    });

    return reply.code(204).send();
  });

  // GET /api/subscriptions/stats - Get subscription statistics
  fastify.get('/stats', async (request, reply) => {
    const user = request.user!;

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    // Calculate monthly total
    const monthlyTotal = subscriptions.reduce((total, sub) => {
      const monthlyPrice =
        sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
      return total + monthlyPrice;
    }, 0);

    // Calculate yearly total
    const yearlyTotal = subscriptions.reduce((total, sub) => {
      const yearlyPrice =
        sub.billingCycle === 'monthly' ? sub.price * 12 : sub.price;
      return total + yearlyPrice;
    }, 0);

    // Group by category
    const byCategory = subscriptions.reduce((acc, sub) => {
      const category = sub.category || 'Other';
      const monthlyPrice =
        sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
      acc[category] = (acc[category] || 0) + monthlyPrice;
      return acc;
    }, {} as Record<string, number>);

    // Find next payment
    const now = new Date();
    const upcomingSubscriptions = subscriptions
      .filter((sub) => new Date(sub.nextBillingDate) >= now)
      .sort((a, b) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime()
      );

    const nextPayment = upcomingSubscriptions[0] || null;

    return {
      monthlyTotal,
      yearlyTotal,
      byCategory,
      nextPayment,
      totalSubscriptions: subscriptions.length,
    };
  });
}
