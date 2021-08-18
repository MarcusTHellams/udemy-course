import { gql } from 'graphql-request';

export const updateTask = gql`
  mutation updateTask($updateTaskInput: UpdateTaskInput!) {
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
