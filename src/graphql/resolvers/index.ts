// Resolvers define how to fetch the types defined in your schema.

import prisma from "../../lib/db";
import { TUserLoginPayload, TUserRegisterPayload } from "../../types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";

// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    users: async () => {
      const users = await prisma.user.findMany();
      return users;
    },
  },
  Mutation: {
    /* 
    |--------------------------------------------
    | Register a new user
    |--------------------------------------------
    */
    register: async (_parent: unknown, args: TUserRegisterPayload) => {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(args.password, 12);
      await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      return true;
    },

    /* 
    |--------------------------------------------
    | Login a user
    |--------------------------------------------
    */
    login: async (_parent: unknown, args: TUserLoginPayload) => {
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(
        args.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.JWT_SECRET!,
      );
      return { token };
    },
  },
};

export default resolvers;
