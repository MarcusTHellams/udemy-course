import gql from "graphql-tag";

export const getRoles = gql`
  query getRoles {
    roles {
      id
      name
    }
  }
`;