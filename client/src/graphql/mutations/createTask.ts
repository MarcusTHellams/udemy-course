import { gql } from 'graphql-request';

export const createTask = gql`
  mutation createTask($createTaskInput: CreateTaskInput!) {
    createTask(createTaskInput: $createTaskInput) {
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
