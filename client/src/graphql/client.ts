import {
  ApolloClient,
  InMemoryCache,
  DefaultOptions
} from "@apollo/client";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}


export const client = new ApolloClient({
  uri: 'http://localhost:5001/graphql',
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions,
});

