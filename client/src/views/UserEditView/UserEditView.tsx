import * as React from "react";
import { useParams } from "react-router-dom";
import { Query } from "../../components/Query/Query";
import { UserForm } from "../../components/UserForm/UserForm";
import { Rclient } from "../../graphql/client";
import { getUser } from "../../graphql/queries/user";
import { User } from "../../types/user.type";
import { Layout } from "../../components/Layout/Layout";

export const UserEditView = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const queryFn = React.useCallback(() => {
    return Rclient.request(getUser, { id }).then(({ user }) => user);
  }, [id]);
  const queryKey = React.useMemo(() => ["user", id], [id]);

  return (
    <>
      <Query<User>
        {...{ queryKey, queryFn }}
        render={({ data: user }) => (
          <Layout maxW="container.sm">
            <UserForm {...{user}} />
          </Layout>
        )}
      />
    </>
  );
};
