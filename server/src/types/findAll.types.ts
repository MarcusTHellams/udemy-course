import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Direction } from 'src/common/entities/pageQuery.input';

export interface FindAll extends IPaginationOptions {
  search?: unknown;
  orderBy?: { field: string; direction: Direction }[];
}
