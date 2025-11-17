import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";
import type { PlantingSession } from "@/types/database";

export default protectedProcedure
  .input(z.object({ sessionId: z.string() }))
  .query(async ({ input, ctx }) => {
    console.log('[Sessions] Getting session details:', input.sessionId);

    const session = await db.getItem<PlantingSession>('sessions', input.sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to session');
    }

    return {
      session,
    };
  });
