import { gql } from "graphql-request";

export const getProfile = gql`
  query getProfile {
    profile
  }
`;
