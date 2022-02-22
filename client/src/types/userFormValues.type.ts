import { Role } from "role.type";
export type UserFormValues = {
  username: string;
  id: string;
  email: string;
  imageUrl?: string;
  roles?: Role[];
  password?: string;
  passwordConfirmation?: string;
};
