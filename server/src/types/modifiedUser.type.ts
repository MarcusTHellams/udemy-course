import { User } from '../user/entities/user.entity';

export type ModifiedUser = Omit<User, 'roles' | 'tasks' | 'password'> & {
  roles: string[];
};
