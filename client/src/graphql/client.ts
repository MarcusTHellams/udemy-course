import {
  ApolloClient,
  InMemoryCache,
  DefaultOptions,
  HttpLink,
} from '@apollo/client';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const httpLink = new HttpLink({
  uri: 'http://localhost:5001/graphql',
});

export const client = new ApolloClient({
  // link: httpLink,
  uri: 'http://localhost:5001/graphql',
  cache: new InMemoryCache({
    addTypename: false,
  }),
  credentials:'include',
  defaultOptions,
});
