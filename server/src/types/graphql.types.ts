import { taskLoader } from './../db/loaders/task.loader';

export interface IGraphqlContext {
  taskLoader: ReturnType<typeof taskLoader>;
}
