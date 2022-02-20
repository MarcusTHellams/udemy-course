import { QueryKeysType } from './../types/queryKey.types';
import { FilterType } from './../types/filter.type';

export const taskQueryKeys: QueryKeysType = {
	all: ['tasks'] as const,
	lists: () => [...taskQueryKeys.all, 'list'] as const,
	list: (filters: FilterType) =>
		[...taskQueryKeys.lists(), ...filters] as const,
	details: () => [...taskQueryKeys.all, 'detail'] as const,
	detail: (id: string | number) => [...taskQueryKeys.details(), id] as const,
};
