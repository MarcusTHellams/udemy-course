import { User } from 'src/user/entities/user.entity';
import Dataloader = require('dataloader');
import { getRepository } from 'typeorm';
import keyBy = require('lodash.keyby');

const batchRoles = async (userIds: string[]) => {
  const user = await getRepository(User)
    .createQueryBuilder('user')
    .select(['user.id'])
    .innerJoinAndSelect('user.roles', 'roles')
    .whereInIds(userIds)
    .getMany();

  const rolesByUserId = keyBy(user, (user) => user.id);
  return userIds.map((userId) => {
    return rolesByUserId[userId]?.roles;
  });
};

export const roleLoader = () => new Dataloader(batchRoles);
