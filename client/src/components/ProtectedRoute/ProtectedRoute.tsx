import * as React from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { useUserContext } from "../../contexts/userContext/userContext";
import { client } from "../../graphql/client";
import { getProfile } from "../../graphql/queries/profile";

export const ProtectedRoute = ({
  children,
}: React.PropsWithChildren<{}>): JSX.Element | null => {
  const queryFn = React.useCallback(() => {
    return client
      .query({
        query: getProfile,
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, []);

  const history = useHistory();
  const location = useLocation();
  const {removeUserStorage} = useUserContext();

  const { isLoading } = useQuery("profile", queryFn, {
    retry: false,
    cacheTime: 0,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    onError() {
      removeUserStorage();
      history.replace("/login", { referrer: location.pathname });
    },
    onSuccess() {},
  });

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};
