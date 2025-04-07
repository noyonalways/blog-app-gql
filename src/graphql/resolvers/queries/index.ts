import { authResolver } from "./auth";
import { blogResolver } from "./blog";

export const Query = {
  ...blogResolver,
  ...authResolver,
};
