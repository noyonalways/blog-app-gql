import { PrismaClient } from "@prisma/client";

export type TAuthContext = {
  prisma: PrismaClient;
  token: string | undefined;
};
