import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/lib/db";

export default protectedProcedure.query(async ({ ctx }) => {
  console.log('[Robot] Getting robots for user:', ctx.user.id);

  const robots = await db.getRobotsByUserId(ctx.user.id);

  return {
    robots,
  };
});
