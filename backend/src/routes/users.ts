import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../services/prisma';
import { telegramAuthMiddleware } from '../middleware/telegram-auth';

// Validation schemas
const updateUserSettingsSchema = z.object({
  notificationDays: z.number().int().min(0).max(30).optional(),
  notificationTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:mm format
  timezone: z.string().optional(),
});

export async function userRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('onRequest', telegramAuthMiddleware);

  // GET /api/users/me - Get current user info
  fastify.get('/me', async (request, reply) => {
    const user = request.user!;

    // Convert BigInt to string for JSON serialization
    const userResponse = {
      ...user,
      telegramId: user.telegramId.toString(),
    };

    return { user: userResponse };
  });

  // PATCH /api/users/me - Update user settings
  fastify.patch('/me', async (request, reply) => {
    const user = request.user!;

    try {
      const data = updateUserSettingsSchema.parse(request.body);

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data,
      });

      const userResponse = {
        ...updatedUser,
        telegramId: updatedUser.telegramId.toString(),
      };

      return { user: userResponse };
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

  // GET /api/users/me/settings - Get user notification settings
  fastify.get('/me/settings', async (request, reply) => {
    const user = request.user!;

    return {
      notificationDays: user.notificationDays,
      notificationTime: user.notificationTime,
      timezone: user.timezone,
    };
  });
}
