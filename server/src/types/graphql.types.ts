import { userLoader } from './../db/loaders/user.loader';
import { roleLoader } from './../db/loaders/role.loader';
import { taskLoader } from './../db/loaders/task.loader';

export interface IGraphqlContext {
  taskLoader: ReturnType<typeof taskLoader>;
  roleLoader: ReturnType<typeof roleLoader>;
  userLoader: ReturnType<typeof userLoader>;
}
