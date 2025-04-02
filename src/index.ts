/* 
|------------------------------------------------------------------------------
| Project Info
|------------------------------------------------------------------------------
| Title: Blog App GraphQL Server
| Description: A GraphQL server for the Blog app
| Author: Noyon Rahaman
| Date: 2025-04-02
| Technologies: Node.js, Express, Apollo Server, GraphQL
|------------------------------------------------------------------------------
*/

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import "./config";
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
async function init() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

init();
