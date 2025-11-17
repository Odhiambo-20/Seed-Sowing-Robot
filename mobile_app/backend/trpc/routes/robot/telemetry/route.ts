import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";
import type { Robot, SensorReading } from "@/types/database";

export default protectedProcedure
  .input(
    z.object({
      robotId: z.string(),
      limit: z.number().min(1).max(1000).optional().default(100),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log('[Robot] Getting telemetry for:', input.robotId);

    const robot = await db.getItem<Robot>('robots', input.robotId);
    
    if (!robot) {
      throw new Error('Robot not found');
    }

    if (robot.userId !== ctx.user.id) {
      throw new Error('Unauthorized access to robot');
    }

    const telemetryData = await db.getTelemetryByRobotId(input.robotId, input.limit);

    if (telemetryData.length === 0) {
      const mockReading: SensorReading = {
        id: 'reading_' + Date.now(),
        robotId: input.robotId,
        timestamp: new Date().toISOString(),
        temperature: 24.5,
        humidity: 65,
        soilMoisture: 42,
        location: {
          latitude: -1.2921,
          longitude: 36.8219,
          altitude: 1795,
          accuracy: 0.05,
        },
        batteryLevel: 85,
        batteryVoltage: 47.2,
        signalStrength: 85,
      };

      return {
        readings: [mockReading],
        count: 1,
      };
    }

    return {
      readings: telemetryData,
      count: telemetryData.length,
    };
  });
