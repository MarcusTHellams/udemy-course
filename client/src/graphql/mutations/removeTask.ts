import gql from 'graphql-tag';

export const removeTask = gql`
  mutation removeTask($id: String!) {
    removeTask(id: $id)
  }
`;
