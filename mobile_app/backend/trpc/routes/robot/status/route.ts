import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";
import type { Robot } from "@/types/database";

export default protectedProcedure
  .input(z.object({ robotId: z.string() }))
  .query(async ({ input, ctx }) => {
    console.log('[Robot] Getting status for:', input.robotId);

    const robot = await db.getItem<Robot>('robots', input.robotId);
    
    if (!robot) {
      throw new Error('Robot not found');
    }

    if (robot.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to robot');
    }

    const mockStatus = {
      ...robot,
      isOnline: true,
      batteryLevel: 75 + Math.random() * 20,
      batteryVoltage: 46.5 + Math.random() * 2,
      currentMode: 'idle' as const,
      currentTask: 'idle' as const,
      location: {
        latitude: -1.2921 + (Math.random() - 0.5) * 0.01,
        longitude: 36.8219 + (Math.random() - 0.5) * 0.01,
        altitude: 1795,
        accuracy: 0.05,
      },
      speed: 0,
      heading: 0,
      lastUpdate: new Date().toISOString(),
    };

    return mockStatus;
  });
