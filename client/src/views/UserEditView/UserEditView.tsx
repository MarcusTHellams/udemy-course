import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Query } from '../../components/Query/Query';
import { UserForm } from '../../components/UserForm/UserForm';
import { client } from '../../graphql/client';
import { getUser } from '../../graphql/queries/user';
import { User } from '../../types/user.type';

export const UserEditView = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const queryFn = React.useCallback(() => {
    return client
      .query({
        query: getUser,
        variables: { id },
      })
      .then(({ data: { user } }) => user);
  }, [id]);
  const queryKey = React.useMemo(() => ['user', id], [id]);

  return (
    <>
      <Query
        {...{ queryKey, queryFn }}
        render={({ data: user }) => <UserForm user={user as User} />}
      />
    </>
  );
};
