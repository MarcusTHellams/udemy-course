import { QueryParamConfig, SetQuery } from 'use-query-params';

export type SetQueryType = SetQuery<{
	search: QueryParamConfig<string | null | undefined, string>;
	page: QueryParamConfig<number | null | undefined, number>;
	limit: QueryParamConfig<number | null | undefined, number>;
	orderBy: QueryParamConfig<Array<unknown> | null | undefined, Array<unknown>>;
}>;
