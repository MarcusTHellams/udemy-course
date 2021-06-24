import gql from 'graphql-tag';

export const updateTask = gql`
  mutation updateTask($updateTaskInput: updateTaskInput!) {
    updateTask(updateTaskInput: $updateTaskInput) {
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
