import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUserContext } from '../../contexts/userContext/userContext';

type ProtectedRouteProps = {
  [key: string] : any;
}

export const ProtectedRoute = ({
  children,
  ...rest
}: React.PropsWithChildren<ProtectedRouteProps>): JSX.Element | null => {
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
