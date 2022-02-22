import { HttpException, HttpStatus } from '@nestjs/common';
import { rule, shield, or, allow } from 'graphql-shield';
import { getUser } from '../helpers/get.user';

export const isAdmin = rule()(async (_, __, ctx) => {
  const user = await getUser(ctx.req);
  if (!user || !user.roles.includes('admin')) {
    throw new HttpException(
      'You are required to be an admin to view, or edit, or delete, or create this resource',
      HttpStatus.UNAUTHORIZED,
    );
  }
  return true;
});

export const canUpdateUser = rule()(async (_, { updateUserInput }, ctx) => {
  const user = await getUser(ctx.req);
  if (user && updateUserInput) {
    return user?.id === updateUserInput?.id
      ? true
      : new HttpException(
          'You are not authorized to update this user',
          HttpStatus.UNAUTHORIZED,
        );
  }
  return new HttpException(
    'You are not authorized to update this user',
    HttpStatus.UNAUTHORIZED,
  );
});

export const canUpdateTask = rule()(async (_, { updateTaskInput }, ctx) => {
  const user = await getUser(ctx.req);
  if (user && updateTaskInput) {
    return user?.id === updateTaskInput?.userId
      ? true
      : new HttpException(
          'You are not authorized to update this task',
          HttpStatus.UNAUTHORIZED,
        );
  }
  return new HttpException(
    'You are not authorized to update this task',
    HttpStatus.UNAUTHORIZED,
  );
});

export const isLoggedIn = rule()(async (_, __, ctx) => {
  const user = await getUser(ctx.req);
  if (user) {
    return true;
  }
  return new HttpException(
    'You are required to be logged in',
    HttpStatus.UNAUTHORIZED,
  );
});

export const permissions = shield(
  {
    // Query: {
    //   // users: isAdmin,
    // },
    Mutation: {
      updateUser: or(isAdmin, canUpdateUser),
      removeUser: isAdmin,
      updateTask: or(isAdmin, canUpdateTask),
      removeTask: isAdmin,
    },
  },
  { fallbackRule: allow, allowExternalErrors: true },
);
