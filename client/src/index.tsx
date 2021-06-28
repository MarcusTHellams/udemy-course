import { ChakraProvider } from '@chakra-ui/react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  ApolloProvider,
} from "@apollo/client";
import { client } from './graphql/client';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { UserContextProvider } from './contexts/userContext/userContext';


const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <UserContextProvider>
              <App />
            </UserContextProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
