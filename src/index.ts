/* 
|------------------------------------------------------------------------------
| Project Info
|------------------------------------------------------------------------------
| Title: Blog App GraphQL Server
| Description: A GraphQL server for the Blog app
| Author: Noyon Rahman
| Date: 2025-04-02
| Technologies: Node.js, Express, Apollo Server, GraphQL, Prisma, PostgreSQL
|------------------------------------------------------------------------------
*/

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "./config";
import resolvers from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";
import prisma from "./lib/db";

async function init() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError(formattedError, _error) {
      // // Check if the error is a GraphQLError
      // if (error instanceof GraphQLError) {
      //   // You can access the original error if it exists
      //   const originalError = error.originalError;
      //   // Check if the original error is an instance of AppError
      //   if (originalError instanceof AppError) {
      //     return {
      //       message: originalError.message,
      //       statusCode: originalError.statusCode,
      //     };
      //   }
      // }

      return formattedError;
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      return {
        prisma,
        token: req.headers.authorization,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

init();
