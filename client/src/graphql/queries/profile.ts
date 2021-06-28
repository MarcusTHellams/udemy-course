import gql from 'graphql-tag';

export const getProfile = gql`
  query getProfile {
    profile
  }
`;
