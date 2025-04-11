import { Blog } from "./blog";
import { Mutation } from "./mutations";
import { Profile } from "./profile";
import { Query } from "./queries";
import { User } from "./user";

const resolvers = {
  Query,
  Blog,
  User,
  Profile,
  Mutation,
};

export default resolvers;
