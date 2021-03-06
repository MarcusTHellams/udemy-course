import { gql } from 'graphql-request';
import { CORE_USER_FIELDS } from "graphql/fragments/user";

export const getUsers = gql`
  query getUsers($pageQueryInput: PageQueryInput) {
    users(pageQueryInput: $pageQueryInput) {
      items {
       ...CoreUserFields
        tasks {
          id
          title
          description
        }
        roles {
          id
          name
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
  ${CORE_USER_FIELDS}
`;
