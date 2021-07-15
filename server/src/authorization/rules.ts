import { rule, shield } from 'graphql-shield';
import { getUser } from 'src/helpers/get.user';

export const isAdmin = rule()(async (_, __, ctx) => {
  const user = (await getUser(ctx.req)) as { roles: string[] };
  if (!user.roles.includes('admin')) {
    return new Error("You don't have access mofo");
  }
  return true;
});

export const permissions = shield({
  Query: {
    users: isAdmin,
  },
});
