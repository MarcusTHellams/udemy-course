import * as React from "react";
import { useTitle } from 'react-use';
import { Layout } from '../../components/Layout/Layout';
import { Query } from '../../components/Query/Query';
import { TaskListComponent } from '../../components/TaskListComponent/TaskListComponent';
import { Rclient } from '../../graphql/client';
import { getTasks } from '../../graphql/queries/tasks';
import { OrderByType } from '../../types/orderBy.type';
import { PaginatedResults } from '../../types/paginatedResults.type';
import { Task } from '../../types/task.type';

export const TaskListView = (): JSX.Element => {
  useTitle('Tasks');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState<OrderByType[]>([]);
  const [search, setSearch] = React.useState('');

  const queryKey = React.useMemo(
    () => ['tasks', page, orderBy, search],
    [page, orderBy, search]
  );
  const queryFn = React.useCallback(() => {
    return Rclient.request(getTasks, {
      pageQueryInput: {
        limit,
        page,
        orderBy,
        search,
      },
    }).then(({ tasks }) => tasks);
  }, [limit, page, orderBy, search]);

  return (
    <>
      <Query<PaginatedResults<Task>>
        queryOptions={{ keepPreviousData: true }}
        {...{ queryKey, queryFn }}
        render={({ data: paginatedTasks }) => {
          return (
            <>
              <Layout>
                <TaskListComponent
                  {...{
                    setLimit,
                    setPage,
                    setOrderBy,
                    setSearch,
                    paginatedTasks,
                  }}
                />
              </Layout>
            </>
          );
        }}
      />
    </>
  );
};
