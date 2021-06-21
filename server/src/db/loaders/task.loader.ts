import Dataloader = require('dataloader');
import { getRepository, In } from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import groupBy = require('lodash.groupby');

const batchTasks = async (userIds: string[]) => {
  const tasks = await getRepository(Task).find({ userId: In(userIds) });

  const taskIdsToUser = groupBy(tasks, ({ userId }) => userId);

  return userIds.map((userId) => taskIdsToUser[userId]);
};

export const taskLoader = () => new Dataloader(batchTasks);
