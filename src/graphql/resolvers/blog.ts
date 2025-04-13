import { userLoader } from "../../dataLoaders/useLoader";

export const Blog = {
  /* 
  |--------------------------------------------
  | Get all blogs - logged in user blogs
  |--------------------------------------------
  */
  author: async (
    parent: { authorId: string },
    _args: unknown,
    // { prisma }: TAuthContext,
  ) => {
    return userLoader.load(parent.authorId);
    // return await prisma.user.findUnique({
    //   where: {
    //     id: parent.authorId,
    //   },
    // });
  },
};
