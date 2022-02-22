import { useUserContext } from "contexts/userContext/userContext";

export const useIsLoggedIn = () => {
  const { userStorage } = useUserContext();
  if (userStorage) {
    return true;
  }
  return false;
};
