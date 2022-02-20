import { QueryKeysType } from './../types/queryKey.types';
import { useQuery } from 'react-query';
import {
	useQueryParams,
	withDefault,
	StringParam,
	NumberParam,
	JsonParam,
} from 'use-query-params';
import { DocumentNode } from 'graphql/language/ast';
import { Rclient } from '../graphql/client';
import { PaginatedResults } from '../types/paginatedResults.type';

type UseGetListType = {
	document: string | DocumentNode;
	keys: QueryKeysType;
	responseName: string;
};

export const useGetList = <T = unknown>({
	document,
	keys,
	responseName,
}: UseGetListType) => {
	const [query, setQuery] = useQueryParams({
		search: withDefault(StringParam, ''),
		page: withDefault(NumberParam, 1),
		limit: withDefault(NumberParam, 10),
		orderBy: withDefault(JsonParam, []),
	});

	const { page, limit, search, orderBy } = query;
	const queryInstance = useQuery<PaginatedResults<T>, Error>({
		queryKey: keys.list([page, limit, orderBy, search]),
		queryFn: async () => {
			return Rclient.request(document, {
				pageQueryInput: {
					limit,
					page,
					orderBy,
					search,
				},
			}).then((response) => response[responseName]);
		},
		keepPreviousData: true,
	});

	return {
		queryInstance,
		setQuery,
	};
};
