import { IRequest } from './../types/requestWithCookie.type';
import * as jwt from 'jsonwebtoken';

export const getUser = async (req: IRequest) => {
  if (!req?.cookies?.todoio) {
    return undefined;
  }

  const decoded = await jwt.verify(req.cookies.todoio, 'mySecret');
  return decoded;
};
