export const typeDefs = `#graphql

  type Query {
    getBlogs: [Blog]
    getMe: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateProfile(payload: ProfileInput): Profile
    createBlog(payload: BlogInput!): Blog
    updateBlog(id: ID!, payload: BlogInput): Blog
    deleteBlog(id: ID!): Message
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
    status: String!
    createdAt: String!
  }

  type Message {
    message: String!
  }

  # inputs
  input BlogInput {
    title: String
    content: String
  }

  input ProfileInput {
    avatar: String
    bio: String
  }
`;
