import { ModifiedUser } from './../types/modifiedUser.type';
import { IRequest } from './../types/requestWithCookie.type';
import * as jwt from 'jsonwebtoken';

export const getUser = async (
  req: IRequest,
): Promise<ModifiedUser | undefined> => {
  if (!req?.cookies?.todoio) {
    return undefined;
  }

  const decoded = await jwt.verify(req.cookies.todoio, 'mySecret');
  return decoded as ModifiedUser;
};
