import * as jwt from 'jsonwebtoken';

export const getUser = async (cookie: string) => {
  if (!cookie) {
    return undefined;
  }

  const decoded = jwt.verify(cookie, 'mySecret');
  return decoded;
};
