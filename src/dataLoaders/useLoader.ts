import { User } from "@prisma/client";
import DataLoader from "dataloader";
import prisma from "../lib/db";

const batchUsers = async (ids: readonly string[]) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));

    return ids.map((id) => {
      const user = userMap.get(id);
      if (!user) {
        return new Error(`User with ID ${id} not found`);
      }
      return user;
    });
  } catch (error) {
    return ids.map(() => error as Error);
  }
};

export const userLoader = new DataLoader<string, User>(batchUsers, {
  cache: true,
  maxBatchSize: 100, // Adjust based on your needs
  batchScheduleFn: (callback) => setTimeout(callback, 0), // Process in next tick
});
