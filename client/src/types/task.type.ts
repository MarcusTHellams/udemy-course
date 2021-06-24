import { User } from "./user.type";

export type Task = {
  id: string;
  description: string;
  title: string;
  user: User;
};
