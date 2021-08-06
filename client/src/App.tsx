import * as React from "react";
import { Header } from "./components/Header/Header";
import { UserList } from "./views/UserList/UserList";
import { Switch, Route } from "react-router-dom";
import { TaskListView } from "./views/TaskListView/TaskListView";
import { TaskEditView } from "./views/TaskEditView/TaskEditView";
import { TaskCreate } from "./components/TaskCreate/TaskCreate";
import { LogIn } from "./components/LogIn/LogIn";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { UserEditView } from "./views/UserEditView/UserEditView";
import { CreateUserView } from "./views/CreateUserView/CreateUserView";

export const App = () => (
  <>
    <Header />
    <Switch>
      <Route exact path='/tasks/create'>
        <TaskCreate />
      </Route>
      <ProtectedRoute exact path='/tasks/:id'>
        <TaskEditView />
      </ProtectedRoute>
      <Route exact path='/signup'>
        <CreateUserView />
      </Route>
      <Route exact path='/users/:id'>
        <UserEditView />
      </Route>
      <Route exact path='/users'>
        <UserList />
      </Route>
      <Route exact path='/login'>
        <LogIn />
      </Route>
      <Route exact path='/'>
        <TaskListView />
      </Route>
    </Switch>
  </>
);
