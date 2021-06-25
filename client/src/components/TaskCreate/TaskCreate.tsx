import * as React from "react";
import { TaskForm } from "../TaskForm/TaskForm";

type TaskCreateProps = {};

export const TaskCreate = (props: TaskCreateProps): JSX.Element => {
  return (
    <>
      <TaskForm />
    </>
  );
};
