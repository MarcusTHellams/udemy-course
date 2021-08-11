import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Direction } from 'src/common/entities/pageQuery.input';

export interface FindAll extends IPaginationOptions {
  search?: string;
  orderBy?: { field: string; direction: Direction }[];
}
