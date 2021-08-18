import { gql } from 'graphql-request';

export const getTasks = gql`
  query getTasks($pageQueryInput: PageQueryInput) {
    tasks(pageQueryInput: $pageQueryInput) {
      items {
        id
        title
        description
        user {
          id
          username
          email
        }
      }
      meta {
        itemCount
        totalItems
        itemsPerPage
        totalPages
        currentPage
      }
      links {
        next
        first
        previous
        last
      }
    }
  }
`;
