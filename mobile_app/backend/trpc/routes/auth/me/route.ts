import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure.query(async ({ ctx }) => {
  console.log('[Auth] Getting current user:', ctx.user.id);

  return {
    user: ctx.user,
  };
});
