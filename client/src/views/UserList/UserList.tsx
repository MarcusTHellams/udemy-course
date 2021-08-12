import * as React from "react";
import { Query } from "../../components/Query/Query";
import { UserListComponent } from "../../components/UserListComponent/UserListComponent";
import { client } from "../../graphql/client";
import { getUsers } from "../../graphql/queries/users";
import { User } from "../../types/user.type";
import { PaginatedResults } from "../../types/paginatedResults.type";
import { OrderByType } from "../../types/orderBy.type";

export const UserList = (): JSX.Element => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState<OrderByType[]>([]);
  const [search, setSearch] = React.useState('');

  const queryKey = React.useMemo(
    () => ["users", page, orderBy, search],
    [page, orderBy, search]
  );
  const queryFn = React.useCallback(() => {
    return client
      .query({
        query: getUsers,
        variables: {
          pageQueryInput: {
            limit,
            page,
            orderBy,
            search
          },
        },
      })
      .then(({ data: { users } }) => users);
  }, [limit, page, orderBy, search]);

  return (
    <>
      <Query
        queryOptions={{ keepPreviousData: true }}
        {...{ queryKey, queryFn }}
        render={({ data: paginatedUsers }) => {
          return (
            <>
              <UserListComponent
                {...{ setPage, setLimit, setOrderBy, setSearch, search }}
                paginatedUsers={paginatedUsers as PaginatedResults<User>}
              />
            </>
          );
        }}
      />
    </>
  );
};
