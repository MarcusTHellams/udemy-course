import gql from 'graphql-tag';

export const getUser = gql`
  query getUser($id: String!) {
    user(id: $id) {
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
