import { gql } from 'graphql-request';

export const logout = gql`
  mutation logout {
    logout
  }
`;
