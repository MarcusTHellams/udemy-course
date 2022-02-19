import * as React from 'react';
import { useTitle } from 'react-use';
import { Query } from '../components/Query/Query2';
import { UserListComponent } from '.';
import { useUserListPage } from '.';
import { UserListPageContextProvider } from './UserListPageContext';

export const UserListPage = (): JSX.Element => {
	useTitle('Users');

	const {
		queryInstance: { isLoading, error, data },
		setQuery,
	} = useUserListPage();

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
