import config from "../../../config";
import AppError from "../../../errors/AppError";
import { TAuthContext } from "../../../types/auth";
import { TDecodedToken } from "../../../types/user";
import { verifyToken } from "../../../utils";

export const authResolver = {
  /* 
  |--------------------------------------------
  | Get the current user
  |--------------------------------------------
  */
  getMe: async (
    _parent: unknown,
    _args: unknown,
    { prisma, token }: TAuthContext,
  ) => {
    if (!token) {
      throw new AppError(401, "Unauthorized");
    }
    const decoded = verifyToken(token, config.JWT_SECRET!) as TDecodedToken;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        profile: true,
        blogs: true,
      },
    });
    return user;
  },
};
