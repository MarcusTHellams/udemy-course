import * as React from 'react';
import { Layout } from '../../components/Layout/Layout';
import { Query } from '../../components/Query/Query';
import { TaskListComponent } from '../../components/TaskListComponent/TaskListComponent';
import { client } from '../../graphql/client';
import { getTasks } from '../../graphql/queries/tasks';
import { Task } from '../../types/task.type';

type TaskListViewProps = {};

const queryFn = () => {
  return client.query({ query: getTasks }).then(({ data: { tasks } }) => tasks);
};
const queryKey = 'tasks';

export const TaskListView = (props: TaskListViewProps): JSX.Element => {
  return (
    <>
      <Query
        {...{ queryKey, queryFn }}
        render={({ data: tasks }) => {
          return (
            <>
              <Layout>
                <TaskListComponent tasks={tasks as Task[]} />
              </Layout>
            </>
          );
        }}
      />
    </>
  );
};
