import AppError from "../../../errors/AppError";
import { TAuthContext } from "../../../types/auth";

export const authResolver = {
  /* 
  |--------------------------------------------
  | Get the current user
  |--------------------------------------------
  */
  getMe: async (
    _parent: unknown,
    _args: unknown,
    { prisma, userInfo }: TAuthContext,
  ) => {
    if (!userInfo) {
      throw new AppError(401, "Unauthorized");
    }
    const userDetails = await prisma.user.findUnique({
      where: { id: userInfo?.id },
      include: {
        profile: true,
        blogs: {
          where: { status: "published" },
          include: {
            author: true,
          },
          orderBy: [
            {
              updatedAt: "desc",
            },
          ],
          take: 10,
        },
      },
    });
    return userDetails;
  },
};
