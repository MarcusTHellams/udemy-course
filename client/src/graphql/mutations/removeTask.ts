import { gql } from 'graphql-request';

export const removeTask = gql`
  mutation removeTask($id: String!) {
    removeTask(id: $id)
  }
`;
