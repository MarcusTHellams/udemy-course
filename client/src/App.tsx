import * as React from "react";
import { Header } from "./components/Header/Header";
import { UserList } from "./views/UserList/UserList";
import { Switch, Route } from "react-router-dom";
import { TaskListView } from "./views/TaskListView/TaskListView";
import { TaskEditView } from "./views/TaskEditView/TaskEditView";
import { TaskCreate } from "./components/TaskCreate/TaskCreate";

export const App = () => (
  <>
    <Header />
    <Switch>
      <Route exact path="/tasks/create">
        <TaskCreate />
      </Route>
      <Route exact path="/tasks/:id">
        <TaskEditView />
      </Route>
      <Route exact path="/users">
        <UserList />
      </Route>
      <Route exact path="/">
        <TaskListView />
      </Route>
    </Switch>
  </>
);
