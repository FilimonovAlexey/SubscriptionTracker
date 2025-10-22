import { FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import { prisma } from '../services/prisma';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

// Validate Telegram Web App initData
export function validateTelegramWebAppData(
  initData: string,
  botToken: string
): { valid: boolean; user?: TelegramUser } {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // Sort parameters alphabetically
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Create hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return { valid: false };
    }

    // Parse user data
    const userParam = urlParams.get('user');
    if (!userParam) {
      return { valid: false };
    }

    const user: TelegramUser = JSON.parse(userParam);
    return { valid: true, user };
  } catch (error) {
    console.error('Error validating Telegram data:', error);
    return { valid: false };
  }
}

// Middleware to authenticate and attach user to request
export async function telegramAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const initData = request.headers['x-telegram-init-data'] as string;

  if (!initData) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Missing Telegram init data',
    });
  }

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    return reply.code(500).send({
      error: 'Server Error',
      message: 'Bot token not configured',
    });
  }

  const validation = validateTelegramWebAppData(initData, botToken);

  if (!validation.valid || !validation.user) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Invalid Telegram init data',
    });
  }

  // Find or create user in database
  let user = await prisma.user.findUnique({
    where: { telegramId: BigInt(validation.user.id) },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId: BigInt(validation.user.id),
        username: validation.user.username,
        firstName: validation.user.first_name,
        lastName: validation.user.last_name,
      },
    });
  } else {
    // Update user info if changed
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: validation.user.username,
        firstName: validation.user.first_name,
        lastName: validation.user.last_name,
      },
    });
  }

  // Attach user to request
  (request as any).user = user;
}

// Type augmentation for FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      telegramId: bigint;
      username: string | null;
      firstName: string | null;
      lastName: string | null;
      notificationDays: number;
      notificationTime: string;
      timezone: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
