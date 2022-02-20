import * as React from 'react';
import { useQuery } from 'react-query';
import { useTitle } from 'react-use';
import { Layout } from '../../components/Layout/Layout';
import { Query } from '../../components/Query/Query2';
import { TaskListComponent } from '../../components/TaskListComponent/TaskListComponent';
import { Rclient } from '../../graphql/client';
import { getTasks } from '../../graphql/queries/tasks';
import { taskQueryKeys } from '../../queryKeys/taskQueryKeys';
import { OrderByType } from '../../types/orderBy.type';
import { PaginatedResults } from '../../types/paginatedResults.type';
import { Task } from '../../types/task.type';

export const TaskListView = (): JSX.Element => {
	useTitle('Tasks');
	const [page, setPage] = React.useState(1);
	const [limit, setLimit] = React.useState(10);
	const [orderBy, setOrderBy] = React.useState<OrderByType[]>([]);
	const [search, setSearch] = React.useState('');

	const { data, error, isLoading } = useQuery<PaginatedResults<Task>, Error>({
		queryKey: taskQueryKeys.list([page, limit, orderBy, search]),
		queryFn: () => {
			return Rclient.request(getTasks, {
				pageQueryInput: {
					limit,
					page,
					orderBy,
					search,
				},
			}).then(({ tasks }) => tasks);
		},
		keepPreviousData: true,
	});

	return (
		<>
			<Query {...{ isLoading }} error={error?.message}>
				<Layout>
					<TaskListComponent
						{...{ setLimit, setPage, setOrderBy, setSearch }}
						paginatedTasks={data}
					/>
				</Layout>
			</Query>
		</>
	);
};
