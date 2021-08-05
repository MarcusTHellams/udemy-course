import { CORE_USER_FIELDS } from './../fragments/user';
import gql from 'graphql-tag';

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
