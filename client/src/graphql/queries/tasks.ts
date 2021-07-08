import gql from "graphql-tag";

export const getTasks = gql`
  query getTasks {
    tasks {
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
