export const typeDefs = `#graphql

  type Query {
    users: [User]
    blogs: [Blog]
    getUserProfile(userId: ID!): Profile
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    token: String!
    message: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    blogs: [Blog]
    profile: Profile
  }

  type Profile {
    id: ID!
    avatar: String
    bio: String
    user: User!
    createdAt: String!
  }

  type Blog {
    id: ID!
    title: String!
    content: String!
    author: User!
    published: Boolean!
    createdAt: String!
  }
`;
