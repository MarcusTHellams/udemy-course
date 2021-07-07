import gql from "graphql-tag";

export const getUsers = gql`
  query getUsers {
    users {
      id
      username
      email
      imageUrl
      tasks {
        id
        title
        description
      }
      roles {
        id
        name
      }
    }
  }
`;