import {
  ApolloClient,
  InMemoryCache,
  DefaultOptions,
  HttpLink,
} from '@apollo/client';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  },
};

const httpLink = new HttpLink({
  uri: 'http://localhost:5001/graphql',
  credentials: 'include'
});


export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions,
});
