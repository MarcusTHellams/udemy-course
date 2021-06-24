import gql from "graphql-tag";

export const getTasks = gql`
  query getTasks {
    tasks {
      id
      title
      description
      user {
        id
        username
        email
      }
    }
  }
`;