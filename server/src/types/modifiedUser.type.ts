import { User } from 'src/user/entities/user.entity';

export type ModifiedUser = Omit<User, 'roles' | 'tasks' | 'password'> & {
  roles: string[];
};
