import * as React from 'react';
import { useLocalStorage } from 'react-use';
import { StorageUser } from '../../types/user.type';

interface UserContextInterface {
  userStorage: string | null | undefined;
  setUserStorage: React.Dispatch<React.SetStateAction<null | undefined>> | null;
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
  const [userStorage, setUserStorage, removeUserStorage] = useLocalStorage(
    'todo-user',
    null
  );
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
