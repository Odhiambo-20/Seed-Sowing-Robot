import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";
import type { User } from "@/types/database";

export default publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(2),
      farmName: z.string().optional(),
      phoneNumber: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[Auth] Registration attempt:', input.email);

    const existingUser = await db.getUserByEmail(input.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const newUser: User = {
      id: userId,
      email: input.email,
      name: input.name,
      farmName: input.farmName,
      phoneNumber: input.phoneNumber,
      role: 'farmer',
      isVerified: false,
      createdAt: now,
      updatedAt: now,
      preferences: {
        notifications: true,
        language: 'en',
        units: 'metric',
      },
    };

    await db.putItem('users', newUser);

    const token = 'mock_auth_token_' + Date.now() + '_' + userId;

    console.log('[Auth] Registration successful:', newUser.email);

    return {
      success: true,
      user: newUser,
      token,
    };
  });
