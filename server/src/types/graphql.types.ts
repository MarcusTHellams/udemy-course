import { roleLoader } from './../db/loaders/role.loader';
import { taskLoader } from './../db/loaders/task.loader';

export interface IGraphqlContext {
  taskLoader: ReturnType<typeof taskLoader>;
  roleLoader: ReturnType<typeof roleLoader>;
}
