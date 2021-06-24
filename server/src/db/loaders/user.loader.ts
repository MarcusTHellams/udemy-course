import Dataloader = require('dataloader');
import { getRepository, In } from 'typeorm';
import keyBy = require('lodash.keyby');
import { User } from 'src/user/entities/user.entity';

const batchUsers = async (taskIds: string[]) => {
  const users = await getRepository(User).find({ id: In(taskIds) });

  const taskIdsToUser = keyBy(users, ({ id }) => id);

  return taskIds.map((userId) => taskIdsToUser[userId]);
};

export const userLoader = () => new Dataloader(batchUsers);
