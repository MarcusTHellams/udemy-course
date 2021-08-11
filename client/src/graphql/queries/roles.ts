import gql from 'graphql-tag';

export const getRoles = gql`
  query getRoles($pageQueryInput: PageQueryInput) {
    roles(pageQueryInput: $pageQueryInput) {
      items {
        id
        name
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
