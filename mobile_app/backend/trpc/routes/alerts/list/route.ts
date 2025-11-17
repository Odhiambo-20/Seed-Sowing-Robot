import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";

export default protectedProcedure
  .input(
    z.object({
      unacknowledgedOnly: z.boolean().optional().default(false),
      limit: z.number().min(1).max(100).optional().default(50),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log('[Alerts] Getting alerts for user:', ctx.user.id);

    const alerts = await db.getAlertsByUserId(ctx.user.id, input.unacknowledgedOnly);

    const limitedAlerts = alerts.slice(0, input.limit);

    return {
      alerts: limitedAlerts,
      total: alerts.length,
      unacknowledged: alerts.filter(a => !a.acknowledged).length,
    };
  });
