import config from "../../../config";
import AppError from "../../../errors/AppError";
import prisma from "../../../lib/db";
import { TCreateBlogPayload, TUpdateBlogPayload } from "../../../types/blog";
import { TDecodedToken } from "../../../types/user";
import { verifyToken } from "../../../utils";

export const blogResolver = {
  /* 
    |--------------------------------------------
    | Create a new blog
    |--------------------------------------------
    */
  createBlog: async (
    _parent: unknown,
    { payload }: { payload: TCreateBlogPayload },
    { token }: { token: string | undefined },
  ) => {
    const { title, content } = payload;

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

    if (!title.trim() || !content.trim()) {
      throw new AppError(400, "Title and content are required");
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        status: "published",
        authorId: user.id,
      },
    });
    return blog;
  },

  /* 
    |--------------------------------------------
    | Update a blog
    |--------------------------------------------
    */
  updateBlog: async (
    _parent: unknown,
    { id, payload }: { id: string; payload: TUpdateBlogPayload },
    { token }: { token: string | undefined },
  ) => {
    const { title, content } = payload || {};

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

    if (!title && !content) {
      throw new AppError(400, "No valid fields to update");
    }

    const blog = await prisma.blog.findUnique({
      where: { id, authorId: user.id },
    });

    if (!blog) {
      throw new AppError(404, "Blog not found");
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blog.id },
      data: { title, content },
    });

    return updatedBlog;
  },

  /* 
    |--------------------------------------------
    | Delete a blog
    |--------------------------------------------
    */
  deleteBlog: async (
    _parent: unknown,
    { id }: { id: string },
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

    const blog = await prisma.blog.findUnique({
      where: { id, authorId: user.id },
    });

    if (!blog) {
      throw new AppError(404, "Blog not found");
    }

    await prisma.blog.delete({
      where: { id: blog.id },
    });

    return { message: "Blog deleted successfully" };
  },
};
