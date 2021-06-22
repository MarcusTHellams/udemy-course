import { UserRole } from './../../user-role/entities/user-role.entity';
import Dataloader = require('dataloader');
import { getRepository } from 'typeorm';
import groupBy = require('lodash.groupby');

const batchRoles = async (userIds: string[]) => {
  const userRoles = await getRepository(UserRole)
    .createQueryBuilder('userRole')
    .innerJoinAndSelect('userRole.role', 'role')
    .where('userId IN (:...userIds)', { userIds })
    .getMany();

  const roleIdsByUser = groupBy(userRoles, (userRole) => userRole.userId);

  const _roleIdsByUser = {};
  Object.keys(roleIdsByUser).forEach((key) => {
    _roleIdsByUser[key] = roleIdsByUser[key].map((userRole) => userRole.role);
  });

  return userIds.map((userId) => _roleIdsByUser[userId]);
};

export const roleLoader = () => new Dataloader(batchRoles);
