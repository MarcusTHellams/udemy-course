import { gql } from "graphql-tag";

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    email
    id
    imageUrl
    username
  }
`;
