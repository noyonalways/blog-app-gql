import AppError from "../../../errors/AppError";
import { TAuthContext } from "../../../types/auth";

export const profileResolvers = {
  /* 
  |--------------------------------------------
  | Get user profile by user id
  |--------------------------------------------
  */
  getProfile: async (
    _parent: unknown,
    _args: unknown,
    { prisma, userInfo }: TAuthContext,
  ) => {
    if (!userInfo) {
      throw new AppError(401, "User not authenticated");
    }
    return await prisma.profile.findUnique({
      where: {
        userId: userInfo?.id,
      },
    });
  },
};
