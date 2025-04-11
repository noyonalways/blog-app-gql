import { PrismaClient } from "@prisma/client";
import { TDecodedToken } from "./user";

export type TAuthContext = {
  prisma: PrismaClient;
  userInfo: TDecodedToken | null;
};
