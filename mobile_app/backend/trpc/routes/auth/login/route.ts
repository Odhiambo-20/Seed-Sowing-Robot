import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";

export default publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[Auth] Login attempt:', input.email);

    const user = await db.getUserByEmail(input.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = 'mock_auth_token_' + Date.now() + '_' + user.id;

    await db.updateItem('users', user.id, {
      lastLoginAt: new Date().toISOString(),
    });

    console.log('[Auth] Login successful:', user.email);

    return {
      success: true,
      user,
      token,
    };
  });
