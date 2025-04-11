import { authResolver } from "./auth";
import { blogResolver } from "./blog";
import { profileResolvers } from "./profile";

export const Query = {
  ...blogResolver,
  ...authResolver,
  ...profileResolvers,
};
