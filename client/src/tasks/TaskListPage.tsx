import * as React from 'react';
import { useTitle } from 'react-use';
import { Layout } from '../components/Layout/Layout';
import { Query } from '../components/Query/Query2';
import { TaskListComponent } from '../components/TaskListComponent/TaskListComponent';
import { getTasks } from '../graphql/queries/tasks';
import { useGetList } from '../hooks/useGetList';
import { taskQueryKeys } from '../queryKeys/taskQueryKeys';
import { Task } from '../types/task.type';

export const TaskListPage = (): JSX.Element => {
	useTitle('Tasks');

	const {
		queryInstance: { isLoading, error },
	} = useGetList<Task>({
		document: getTasks,
		keys: taskQueryKeys,
		responseName: 'tasks',
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
