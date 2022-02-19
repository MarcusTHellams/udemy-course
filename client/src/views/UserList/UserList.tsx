import * as React from 'react';
import { useTitle } from 'react-use';
import { useQuery } from 'react-query';
import { Query } from '../../components/Query/Query2';
import { UserListComponent } from '../../components/UserListComponent/UserListComponent';
import { Rclient } from '../../graphql/client';
import { getUsers } from '../../graphql/queries/users';
import { User } from '../../types/user.type';
import { PaginatedResults } from '../../types/paginatedResults.type';
import { OrderByType } from '../../types/orderBy.type';
import {
	useQueryParams,
	NumberParam,
	StringParam,
	JsonParam,
	withDefault,
} from 'use-query-params';

export const UserList = (): JSX.Element => {
	useTitle('Users');

	const [query, setQuery] = useQueryParams({
		search: withDefault(StringParam, ''),
		page: withDefault(NumberParam, 1),
		limit: withDefault(NumberParam, 10),
		orderBy: withDefault(JsonParam, []),
	});

	const { page, limit, search, orderBy } = query;

	const { data, isLoading, error } = useQuery<PaginatedResults<User>, Error>({
		queryKey: ['users', page, orderBy, search, limit],
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

	return (
		<>
			<Query {...{ isLoading }} error={error?.message}>
				<UserListComponent
					paginatedUsers={data}
					{...{
						setQuery,
					}}
				/>
			</Query>
		</>
	);
};
