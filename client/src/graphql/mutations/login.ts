import {gql} from 'graphql-request';

export const login = gql`
  mutation login($password: String! $username: String!) {
    login(password: $password username: $username)
  }
`;
