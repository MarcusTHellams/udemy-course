import gql from "graphql-tag";
import { CORE_USER_FIELDS } from "./../fragments/user";

export const updateUser = gql`
  mutation updateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      ...CoreUserFields
      roles {
        id
        name
      }
      tasks {
        id
        title
        description
      }
    }
  }
  ${CORE_USER_FIELDS}
`;

export const createUser = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      ...CoreUserFields
    }
  }
  ${CORE_USER_FIELDS}
`;

export const removeUser = gql`
  mutation removeUser($id: String!) {
    removeUser(id: $id)
  }
`;
