import { StorageUser } from "types/user.type";
import { useUserContext } from "contexts/userContext/userContext";

export const useIsAdmin = (): boolean => {
  const { userStorage } = useUserContext();
  let user: StorageUser;
  let isAdmin: boolean = false;
  if (userStorage) {
    user = JSON.parse(userStorage) || {};
    isAdmin = user?.roles.includes("admin");
  }

  return isAdmin;
};
