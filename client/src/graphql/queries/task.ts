import { gql } from 'graphql-request';

export const getTask = gql`
  query getTask($id: String!) {
    task(id: $id) {
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
