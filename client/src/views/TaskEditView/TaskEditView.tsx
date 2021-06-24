import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Query } from '../../components/Query/Query';
import { TaskForm } from '../../components/TaskForm/TaskForm';
import { client } from '../../graphql/client';
import { getTask } from '../../graphql/queries/task';
import { Task } from '../../types/task.type';

type TaskParams = {
  id: string;
};

export const TaskEditView = (): JSX.Element => {
  const { id } = useParams<TaskParams>();

  const queryFn = React.useCallback(() => {
    return client
      .query({ query: getTask, variables: { id } })
      .then(({ data: { task } }) => task);
  }, [id]);
  const queryKey = React.useMemo(() => ['task', id], [id]);
  return (
    <>
      <Query
        {...{ queryKey, queryFn }}
        render={({ data: task }) => <TaskForm task={task as Task} />}
      />
    </>
  );
};
