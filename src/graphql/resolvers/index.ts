import bcrypt from "bcrypt";
import config from "../../config";
import AppError from "../../errors/AppError";
import prisma from "../../lib/db";
import { TUserLoginPayload, TUserRegisterPayload } from "../../types/user";
import { generateToken } from "../../utils";

const resolvers = {
  Query: {
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
        throw new AppError(400, "User already exists");
      }

      const hashedPassword = await bcrypt.hash(args.password, 12);
      const user = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });

      // Create a profile for the user
      await prisma.profile.create({
        data: {
          userId: user.id,
        },
      });

      return {
        token: generateToken(
          { id: user.id, email: user.email },
          config.JWT_SECRET!,
          { expiresIn: "1d" },
        ),
        message: "User created successfully",
      };
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
        throw new AppError(404, "User not found");
      }

      const isPasswordValid = await bcrypt.compare(
        args.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new AppError(401, "Invalid password");
      }

      const token = generateToken(
        { id: user.id, email: user.email },
        config.JWT_SECRET!,
        { expiresIn: "1d" },
      );
      return { token, message: "Login successful" };
    },
  },
};

export default resolvers;
