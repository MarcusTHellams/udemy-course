import * as React from "react";
import { Header } from "./components/Header/Header";
import { UserList } from "./views/UserList/UserList";
import { Switch, Route } from "react-router-dom";
import { TaskListView } from "./views/TaskListView/TaskListView";
import { TaskEditView } from "./views/TaskEditView/TaskEditView";
import { TaskCreate } from "./components/TaskCreate/TaskCreate";
import { LogIn } from "./components/LogIn/LogIn";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

export const App = () => (
  <>
    <Header />
    <Switch>
      <Route exact path="/tasks/create">
        <TaskCreate />
      </Route>
      <Route exact path="/tasks/:id">
        <ProtectedRoute>
          <TaskEditView />
        </ProtectedRoute>
      </Route>
      <Route exact path="/users">
        <UserList />
      </Route>
      <Route exact path="/login">
        <LogIn />
      </Route>
      <Route exact path="/">
        <TaskListView />
      </Route>
    </Switch>
  </>
);
