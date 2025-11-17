import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";
import type { Alert } from "@/types/database";

export default protectedProcedure
  .input(z.object({ alertId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    console.log('[Alerts] Acknowledging alert:', input.alertId);

    const alert = await db.getItem<Alert>('alerts', input.alertId);
    
    if (!alert) {
      throw new Error('Alert not found');
    }

    if (alert.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to alert');
    }

    await db.updateItem<Alert>('alerts', input.alertId, {
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: ctx.user.id,
    });

    return {
      success: true,
      alertId: input.alertId,
    };
  });
