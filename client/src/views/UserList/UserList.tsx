import * as React from 'react';
import { Query } from '../../components/Query/Query';
import { UserListComponent } from '../../components/UserListComponent/UserListComponent';
import { client } from '../../graphql/client';
import { getUsers } from '../../graphql/queries/users';
import { User } from '../../types/user.type';

const queryFn = () => {
  return client.query({ query: getUsers }).then(({ data: { users } }) => users);
};
const queryKey = 'users';

export const UserList = (): JSX.Element => {
  return (
    <>
      <Query
        {...{ queryKey, queryFn }}
        render={({ data: users }) => {
          return (
            <>
              <UserListComponent users={users as User[]} />
            </>
          );
        }}
      />
    </>
  );
};
