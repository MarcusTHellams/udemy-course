import {
  SelectQueryBuilder,
  Repository,
  FindConditions,
  FindManyOptions,
} from 'typeorm';

interface InfiniteLoadingReturn<T> {
  hasNextPage: boolean;
  items: T[];
}

interface InfiniteLoadingOptions {
  limit: number;
  currentRowCount: number;
}

export async function infiniteLoading<T>(
  repositoryOrQueryBuilder: SelectQueryBuilder<T>,
  options: InfiniteLoadingOptions,
): Promise<InfiniteLoadingReturn<T>>;
export async function infiniteLoading<T>(
  repositoryOrQueryBuilder: Repository<T>,
  options: InfiniteLoadingOptions,
  searchOptions?: FindManyOptions | FindConditions<T>,
): Promise<InfiniteLoadingReturn<T>>;
export async function infiniteLoading<T>(
  repositoryOrQueryBuilder: SelectQueryBuilder<T> | Repository<T>,
  options: InfiniteLoadingOptions,
  searchOptions?: FindManyOptions | FindConditions<T>,
): Promise<InfiniteLoadingReturn<T>> {
  return repositoryOrQueryBuilder instanceof Repository
    ? repositoryInfiniteLoading<T>(
        repositoryOrQueryBuilder,
        options,
        searchOptions,
      )
    : queryBuilderInfiniteLoading(repositoryOrQueryBuilder, options);
}

async function repositoryInfiniteLoading<T>(
  repository: Repository<T>,
  options: InfiniteLoadingOptions,
  searchOptions?: FindManyOptions | FindConditions<T>,
): Promise<InfiniteLoadingReturn<T>> {
  const [results, count] = await repository.findAndCount({
    take: options.currentRowCount + options.limit,
    ...searchOptions,
  });
  console.log('count: ', count);
  const hasNextPage = count - (options.currentRowCount + options.limit) > 0;
  return {
    items: results,
    hasNextPage,
  };
}
async function queryBuilderInfiniteLoading<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: InfiniteLoadingOptions,
): Promise<InfiniteLoadingReturn<T>> {
  const [results, count] = await queryBuilder
    .limit(options.currentRowCount + options.limit)
    .getManyAndCount();
  const hasNextPage = count - (options.currentRowCount + options.limit) > 0;
  console.log(
    'count - (options.currentRowCount + options.limit): ',
    count - (options.currentRowCount + options.limit),
  );
  console.log('count: ', count);
  return {
    items: results,
    hasNextPage,
  };
}
