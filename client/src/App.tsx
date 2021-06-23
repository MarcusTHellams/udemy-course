import * as React from 'react';
import { Header } from './components/Header/Header';
import { Layout } from './components/Layout/Layout';

export const App = () => (
  <>
    <Header />
    <Layout>
      <h1>Hello from App</h1>
    </Layout>
  </>
);
