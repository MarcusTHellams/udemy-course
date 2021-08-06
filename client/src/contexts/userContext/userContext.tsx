import * as React from 'react';
import { useQuery } from 'react-query';
import { useLocalStorage } from 'react-use';
import { client } from '../../graphql/client';
import { getProfile } from '../../graphql/queries/profile';

const queryFn = () => {
  return client
    .query({
      query: getProfile,
    })
    .catch((error: Error) => {
      throw new Error(error.message);
    });
};
interface UserContextInterface {
  userStorage: string | null | undefined;
  setUserStorage: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  > | null;
  removeUserStorage: () => void | null;
}

const UserContext = React.createContext<UserContextInterface>({
  userStorage: null,
  setUserStorage: null,
  removeUserStorage: () => {},
});

export const useUserContext = () => React.useContext(UserContext);

type UserContextProviderProps = {};

export const UserContextProvider = ({
  children,
}: React.PropsWithChildren<UserContextProviderProps>): JSX.Element => {
  const [userStorage, setUserStorage, removeUserStorage] = useLocalStorage<
    string | null
  >('todo-user', null);

  useQuery('profile', queryFn, {
    retry: false,
    cacheTime: 0,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    onError() {
      removeUserStorage();
    },
  });

  return (
    <>
      <UserContext.Provider
        value={{ userStorage, setUserStorage, removeUserStorage }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};
