import gql from 'graphql-tag';

export const updateTask = gql`
  mutation updateTask($updateTaskInput: UpdateTaskInput!) {
    updateTask(updateTaskInput: $updateTaskInput) {
      id
      title
      description
      userId
      user {
        id
        username
        email
      }
    }
  }
`;
