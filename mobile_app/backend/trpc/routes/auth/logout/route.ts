import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure.mutation(async ({ ctx }) => {
  console.log('[Auth] Logout:', ctx.user.id);

  return {
    success: true,
  };
});
