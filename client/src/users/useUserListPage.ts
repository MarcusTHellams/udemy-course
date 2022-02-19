import { useQuery } from 'react-query';
import {
	useQueryParams,
	withDefault,
	StringParam,
	NumberParam,
	JsonParam,
} from 'use-query-params';
import { userQueryKeys } from './userQueryKeys';
import { Rclient } from '../graphql/client';
import { getUsers } from '../graphql/queries/users';
import { PaginatedResults } from '../types/paginatedResults.type';
import { User } from '../types/user.type';

export const useUserListPage = () => {
	const [query, setQuery] = useQueryParams({
		search: withDefault(StringParam, ''),
		page: withDefault(NumberParam, 1),
		limit: withDefault(NumberParam, 10),
		orderBy: withDefault(JsonParam, []),
	});

	const { page, limit, search, orderBy } = query;
	const queryInstance = useQuery<PaginatedResults<User>, Error>({
		queryKey: userQueryKeys.list([page, limit, orderBy, search]),
		queryFn: async () => {
			return Rclient.request(getUsers, {
				pageQueryInput: {
					limit,
					page,
					orderBy,
					search,
				},
			}).then(({ users }) => users);
		},
		keepPreviousData: true,
	});

	return {
		queryInstance,
		setQuery,
	};
};
