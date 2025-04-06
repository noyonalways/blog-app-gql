import config from "../../../config";
import AppError from "../../../errors/AppError";
import prisma from "../../../lib/db";
import { TDecodedToken } from "../../../types/user";
import { verifyToken } from "../../../utils";

export const blogResolver = {
  /* 
    |--------------------------------------------
    | Get all blogs - logged in user blogs
    |--------------------------------------------
    */
  getBlogs: async (
    _parent: unknown,
    _args: unknown,
    { token }: { token: string | undefined },
  ) => {
    if (!token) {
      throw new AppError(401, "Unauthorized");
    }

    const decoded = verifyToken(token, config.JWT_SECRET!) as TDecodedToken;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const blogs = await prisma.blog.findMany({
      where: { authorId: user.id },
      include: {
        author: true,
      },
    });
    return blogs;
  },
};
