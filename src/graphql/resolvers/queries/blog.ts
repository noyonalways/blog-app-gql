import AppError from "../../../errors/AppError";
import { TAuthContext } from "../../../types/auth";

export const blogResolver = {
  /* 
  |--------------------------------------------
  | Get all blogs - logged in user blogs
  |--------------------------------------------
  */
  getBlogs: async (
    _parent: unknown,
    _args: unknown,
    { prisma, userInfo }: TAuthContext,
  ) => {
    if (!userInfo) {
      throw new AppError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: userInfo.id },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const blogs = await prisma.blog.findMany({
      where: { authorId: user.id },
      include: {
        author: true,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    });
    return blogs;
  },

  /* 
  |--------------------------------------------
  | Get all blogs - for admin
  |--------------------------------------------
  */
  getAllBlogs: async (
    _parent: unknown,
    _args: unknown,
    { prisma }: TAuthContext,
  ) => {
    const blogs = await prisma.blog.findMany({
      include: {
        author: true,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    });
    return blogs;
  },
};
