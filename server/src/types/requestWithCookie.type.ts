import { Request } from 'express';

export interface IRequest extends Request {
  cookies: {
    todoio: string;
  };
}
