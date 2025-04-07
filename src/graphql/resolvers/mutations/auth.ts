import bcrypt from "bcrypt";
import config from "../../../config";
import AppError from "../../../errors/AppError";
import prisma from "../../../lib/db";
import { TAuthContext } from "../../../types/auth";
import {
  TDecodedToken,
  TUserLoginPayload,
  TUserProfilePayload,
  TUserRegisterPayload,
} from "../../../types/user";
import { generateToken, verifyToken } from "../../../utils";

export const authResolver = {
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

    const isPasswordValid = await bcrypt.compare(args.password, user.password);

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

  /* 
  |--------------------------------------------
  | Update the login user profile
  |--------------------------------------------
  */
  updateProfile: async (
    _parent: unknown,
    { payload }: { payload: TUserProfilePayload },
    { prisma, token }: TAuthContext,
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

    const { bio, avatar } = payload || {};

    if (!bio && !avatar) {
      throw new AppError(400, "No valid fields to update");
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: { bio, avatar },
      include: {
        user: true,
      },
    });

    return updatedProfile;
  },
};
