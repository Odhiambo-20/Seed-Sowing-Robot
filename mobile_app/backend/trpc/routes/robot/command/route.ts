import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";
import type { Robot } from "@/types/database";

export default protectedProcedure
  .input(
    z.object({
      robotId: z.string(),
      command: z.enum(['start', 'stop', 'pause', 'resume', 'emergency_stop', 'return_home']),
      params: z.record(z.any()).optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log('[Robot] Sending command:', input.command, 'to robot:', input.robotId);

    const robot = await db.getItem<Robot>('robots', input.robotId);
    
    if (!robot) {
      throw new Error('Robot not found');
    }

    if (robot.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to robot');
    }

    return {
      success: true,
      command: input.command,
      robotId: input.robotId,
      timestamp: new Date().toISOString(),
      message: `Command ${input.command} sent successfully`,
    };
  });
