import * as React from 'react';
import * as qs from 'qs';
import { useLocation, useHistory } from 'react-router-dom';
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
	getParsedSearch,
	usePaginationParams,
} from '../../hooks/usePaginationParams';

export const UserList = (): JSX.Element => {
	useTitle('Users');
	const S = getParsedSearch();
	const [page, setPage] = React.useState(Number(S.page) || 1);
	const [limit, setLimit] = React.useState(Number(S.limit) || 10);
	const [orderBy, setOrderBy] = React.useState<OrderByType[]>(
		(S.orderBy && JSON.parse(S.orderBy as string)) || []
	);
	const [search, setSearch] = React.useState(S.search || '');

	const { data, isLoading, error } = useQuery<PaginatedResults<User>, Error>({
		queryKey: ['users', page, orderBy, search],
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

	usePaginationParams({
		page,
		limit,
		search,
		orderBy,
		setPage,
		setLimit,
		setOrderBy,
		setSearch,
	});

	return (
		<>
			<Query {...{ isLoading }} error={error?.message}>
				<UserListComponent
					paginatedUsers={data}
					{...{
						setPage,
						setLimit,
						setOrderBy,
						setSearch,
					}}
				/>
			</Query>
		</>
	);
};
