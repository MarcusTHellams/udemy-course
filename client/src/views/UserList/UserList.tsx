import * as React from "react";
import { Query } from "../../components/Query/Query";
import { UserListComponent } from "../../components/UserListComponent/UserListComponent";
import { Rclient } from "../../graphql/client";
import { getUsers } from "../../graphql/queries/users";
import { User } from "../../types/user.type";
import { PaginatedResults } from "../../types/paginatedResults.type";
import { OrderByType } from "../../types/orderBy.type";

export const UserList = (): JSX.Element => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState<OrderByType[]>([]);
  const [search, setSearch] = React.useState("");

  const queryKey = React.useMemo(
    () => ["users", page, orderBy, search],
    [page, orderBy, search]
  );
  const queryFn = React.useCallback(() => {
    return Rclient.request(getUsers, {
      pageQueryInput: {
        limit,
        page,
        orderBy,
        search,
      },
    }).then(({ users }) => users);
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
                {...{ setPage, setLimit, setOrderBy, setSearch }}
                paginatedUsers={paginatedUsers as PaginatedResults<User>}
              />
            </>
          );
        }}
      />
    </>
  );
};
