import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";
import type { PlantingSession } from "@/types/database";

export default protectedProcedure
  .input(
    z.object({
      robotId: z.string().optional(),
      farmId: z.string().optional(),
      status: z.enum(['planned', 'in_progress', 'paused', 'completed', 'failed']).optional(),
      limit: z.number().min(1).max(100).optional().default(20),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log('[Sessions] Getting sessions for user:', ctx.user.id);

    const sessions = await db.query<PlantingSession>(
      'sessions',
      (session) => {
        if (session.userId !== ctx.user.id) return false;
        if (input.robotId && session.robotId !== input.robotId) return false;
        if (input.farmId && session.farmId !== input.farmId) return false;
        if (input.status && session.status !== input.status) return false;
        return true;
      },
      { limit: input.limit, sortOrder: 'desc' }
    );

    return {
      sessions,
      total: sessions.length,
    };
  });
