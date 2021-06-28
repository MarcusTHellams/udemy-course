import { Role } from "./role.type";
import { Task } from "./task.type";

export type User = {
  email: string;
  id: string;
  username: string;
  roles: Role[];
  tasks: Task[];
}

export type StorageUser = {
  email: string;
  id: string;
  username: string;
  roles: string[];
}