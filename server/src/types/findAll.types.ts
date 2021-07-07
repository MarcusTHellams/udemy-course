import { IPaginationOptions } from 'nestjs-typeorm-paginate';

export interface FindAll extends IPaginationOptions {
  search?: unknown;
  orderBy?: unknown;
}
