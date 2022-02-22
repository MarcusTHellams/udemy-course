import * as React from "react";
import { TaskForm } from "components/TaskForm/TaskForm";

type TaskCreateProps = {};

export const TaskCreate = (props: TaskCreateProps): JSX.Element => {
  return (
    <>
      <TaskForm />
    </>
  );
};
