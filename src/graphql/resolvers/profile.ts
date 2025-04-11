import { TAuthContext } from "../../types/auth";

export const Profile = {
  /* 
  |--------------------------------------------
  | Get user info from profile - logged in user
  |--------------------------------------------
  */
  user: async (
    parent: { userId: string },
    _args: unknown,
    { prisma }: TAuthContext,
  ) => {
    return await prisma.user.findUnique({
      where: {
        id: parent?.userId,
      },
    });
  },
};
