import axios from 'axios';
import * as React from 'react';
import { Header } from './components/Header/Header';
import { Layout } from './components/Layout/Layout';
import { Query } from './components/Query/Query';

const queryFn = () => {
  return axios.get('http://google.com').then(({ data }) => data);
};

export const App = () => (
  <>
    <Header />
    <Query
      queryKey='test'
      queryFn={queryFn}
      render={({ data }) => {
        console.log('data: ', data);
        return (
          <Layout>
            <h2>Hello from Query</h2>
          </Layout>
        );
      }}
    />
  </>
);
