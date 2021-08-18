
import { GraphQLClient } from "graphql-request";

export const Rclient = new GraphQLClient("http://localhost:5001/graphql", {
  credentials: "include",
  cache: 'no-cache',
});
