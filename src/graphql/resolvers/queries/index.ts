import AppError from "../../../errors/AppError";
import prisma from "../../../lib/db";

export const Query = {
  /* 
    |--------------------------------------------
    | Get all users
    |--------------------------------------------
    */
  users: async () => {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    return users;
  },

  /* 
    |--------------------------------------------
    | Get a user's profile by user id
    |--------------------------------------------
    */
  getUserProfile: async (_parent: unknown, args: { userId: string }) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: args.userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new AppError(404, "Profile not found");
    }

    return profile;
  },
};
