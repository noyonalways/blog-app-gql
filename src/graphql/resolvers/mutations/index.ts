import { authResolver } from "./auth";
import { blogResolver } from "./blog";

export const Mutation = {
  ...authResolver,
  ...blogResolver,
};
