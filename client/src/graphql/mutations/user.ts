import gql from 'graphql-tag';

export const updateUser = gql`
  mutation updateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      username
      email
      imageUrl
      roles {
        id
        name
      }
      tasks {
        id
        title
        description
      }
    }
  }
`;
