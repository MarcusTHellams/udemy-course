import { Heading } from '@chakra-ui/react';
import * as React from 'react';
import { User } from '../types/user.type';
import { Layout } from '../components/Layout/Layout';
import { PaginatedResults } from '../types/paginatedResults.type';
import { DeletionVerification } from '../components/DeletionVerification/DeletionVerification';
import { userQueryKeys } from '.';
import { useItemListComponent } from '../hooks/useItemListComponent';
import { removeUser } from '../graphql/mutations/user';
import { SetQueryType } from '../types/setQuery.type';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';
import { userListColumns } from '.';
import { TableComponent } from '../components/TableComponent/TableComponent';

type UserListComponentProps = {
	paginatedUsers?: PaginatedResults<User>;
	setQuery: SetQueryType;
};

export const UserListComponent = ({
	paginatedUsers = {
		items: [],
		meta: { itemCount: 0, totalItems: 0, totalPages: 0, currentPage: 1 },
	},
	setQuery,
}: UserListComponentProps): JSX.Element => {
	const {
		items,
		meta: { totalPages, currentPage },
	} = paginatedUsers;

	const isAdmin = useIsAdmin();
	const [open, setOpen] = React.useState(false);
	const [currentItem, setCurrentItem] = React.useState<
		string | null | undefined
	>();
	const isLoggedIn = useIsLoggedIn();

	const columns = React.useMemo(() => {
		return userListColumns({
			isAdmin,
			isLoggedIn,
			setCurrentItem,
			setOpen,
		});
	}, [isAdmin, isLoggedIn]);

	const { tableInstance, changeHandler, onClose, onDelete, limitRef } =
		useItemListComponent<User>({
			currentPage,
			totalPages,
			document: removeUser,
			queryKeys: userQueryKeys,
			setQuery,
			items,
			columns,
			setOpen,
			open,
			setCurrentItem,
			currentItem,
		});

	const { getTableProps, headerGroups, getTableBodyProps, page, prepareRow } =
		tableInstance;

	return (
		<>
			<Layout>
				<Heading size="xl" as="h1" mb="4">
					Users
				</Heading>
				<TableComponent
					title="User Search"
					descriptionText="Search by username, or email, or by role name"
					searchHandler={changeHandler}
					{...{
						getTableProps,
						headerGroups,
						getTableBodyProps,
						page,
						prepareRow,
						totalPages,
						currentPage,
						setQuery,
						limitRef,
					}}
				/>
			</Layout>
			<DeletionVerification
				alertProps={{
					isCentered: true,
					closeOnOverlayClick: false,
				}}
				{...{ onClose, onDelete }}
				isOpen={open}
				title="Delete User"
				bodyText="Are you sure you want to delete the user?"
			/>
		</>
	);
};
