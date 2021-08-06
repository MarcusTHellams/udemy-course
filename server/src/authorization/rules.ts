import { rule, shield, or, and } from 'graphql-shield';
import { getUser } from 'src/helpers/get.user';

export const isAdmin = rule()(async (_, __, ctx) => {
  const user = await getUser(ctx.req);
  if (!user.roles.includes('admin')) {
    return false;
  }
  return true;
});

export const canUpdateUser = rule()(async (_, { updateUserInput }, ctx) => {
  const user = await getUser(ctx.req);
  if (user && updateUserInput) {
    return user?.id === updateUserInput?.id;
  }
  return false;
});

export const permissions = shield({
  // Query: {
  //   users: isAdmin,
  // },
  Mutation: {
    updateUser: or(isAdmin, canUpdateUser),
  },
});
