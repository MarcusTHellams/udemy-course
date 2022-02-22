import * as React from 'react';
import { useTitle } from 'react-use';
import { Query } from "components/Query/Query2";
import { UserListComponent, userQueryKeys } from ".";
import { UserListPageContextProvider } from "./UserListPageContext";
import { useGetList } from "hooks/useGetList";
import { getUsers } from "graphql/queries/users";
import { User } from "types/user.type";

export const UserListPage = (): JSX.Element => {
	useTitle('Users');

	const {
		setQuery,
		queryInstance: { isLoading, error, data },
	} = useGetList<User>({
		document: getUsers,
		keys: userQueryKeys,
		responseName: 'users',
	});

	return (
		<>
			<Query {...{ isLoading }} error={error?.message}>
				<UserListPageContextProvider {...{ setQuery }}>
					<UserListComponent
						paginatedUsers={data}
						{...{
							setQuery,
						}}
					/>
				</UserListPageContextProvider>
			</Query>
		</>
	);
};
