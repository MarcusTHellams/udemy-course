import { gql } from 'graphql-request';

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    email
    id
    imageUrl
    username
  }
`;
