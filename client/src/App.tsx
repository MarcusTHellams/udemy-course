import * as React from 'react';
import { Header } from './components/Header/Header';
import { UserList } from './views/UserList/UserList';

export const App = () => (
  <>
    <Header />
    <UserList />
  </>
);
