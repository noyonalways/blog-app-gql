import { TAuthContext } from "../../types/auth";

export const User = {
  /* 
  |--------------------------------------------
  | Get all blogs
  |--------------------------------------------
  */
  blogs: async (
    parent: { id: string },
    _args: unknown,
    { prisma }: TAuthContext,
  ) => {
    return await prisma.blog.findMany({
      where: {
        authorId: parent.id,
      },
    });
  },
};
