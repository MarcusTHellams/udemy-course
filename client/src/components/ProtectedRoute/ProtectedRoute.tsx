import * as React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useUserContext } from "contexts/userContext/userContext";


export const ProtectedRoute = ({
  children,
  ...rest
}: RouteProps): JSX.Element | null => {
  const { userStorage } = useUserContext();

  return (
    <>
      <Route
        {...rest}
        render={({ location }) =>
          !!userStorage ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { referrer: location.pathname },
              }}
            />
          )
        }
      />
    </>
  );
};
