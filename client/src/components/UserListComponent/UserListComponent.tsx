import {
	Badge,
	Box,
	Heading,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	Wrap,
	WrapItem,
	Button,
	ButtonGroup,
	Avatar,
	HStack,
	Text,
	Icon,
	useToast,
	Container,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Role } from '../../types/role.type';
import { User } from '../../types/user.type';
import { Layout } from '../Layout/Layout';
import { PaginatedResults } from '../../types/paginatedResults.type';
import { DirectionEnum, OrderByType } from '../../types/orderBy.type';
import {
	useTable,
	usePagination,
	Column,
	Row,
	HeaderGroup,
	useSortBy,
} from 'react-table';
import { Paginated } from '@makotot/paginated';
import { usePrevious } from 'react-use';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ResponsiveTable } from '../ResponsiveTable/ResponsiveTable';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { DeletionVerification } from '../DeletionVerification/DeletionVerification';
import { useMutation, useQueryClient } from 'react-query';
import { Rclient } from '../../graphql/client';
import { removeUser } from '../../graphql/mutations/user';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { SearchComponent } from '../SearchComponent/SearchComponent';
import { getParsedSearch } from '../../hooks/usePaginationParams';

type UserListComponentProps = {
	paginatedUsers?: PaginatedResults<User>;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	setLimit: React.Dispatch<React.SetStateAction<number>>;
	setOrderBy: React.Dispatch<React.SetStateAction<OrderByType[]>>;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
};

type CurrentUser = string | null | undefined;

export const UserListComponent = ({
	paginatedUsers = {
		items: [],
		meta: { itemCount: 0, totalItems: 0, totalPages: 0, currentPage: 1 },
	},
	setPage,
	setOrderBy,
	setSearch,
}: UserListComponentProps): JSX.Element => {
	const {
		items,
		meta: { totalPages, currentPage },
	} = paginatedUsers;

	const search = getParsedSearch();

	const data = React.useMemo(() => items, [items]);
	const isAdmin = useIsAdmin();
	const [open, setOpen] = React.useState(false);
	const [currentUser, setCurrentUser] = React.useState<CurrentUser>();
	const toast = useToast();
	const isLoggedIn = useIsLoggedIn();
	const changeHandler = React.useCallback(
		(searchTerm: string) => {
			setPage(1);
			setSearch(searchTerm);
		},
		[setPage, setSearch]
	);

	const mutationFn = React.useCallback((userId) => {
		return Rclient.request(removeUser, { id: userId }).then(
			({ removeUser }) => removeUser
		);
	}, []);

	const queryClient = useQueryClient();

	const { mutate } = useMutation<boolean, Error, CurrentUser>(mutationFn, {
		onSuccess() {
			queryClient.invalidateQueries();
		},
		onSettled() {
			setOpen(false);
		},
		onError(error) {
			toast({
				description: error?.message,
				duration: null,
				isClosable: true,
				position: 'top',
				status: 'error',
				title: 'Error',
			});
		},
	});

	const onClose = React.useCallback(() => {
		setOpen(false);
	}, []);

	const onDelete = React.useCallback(() => {
		mutate(currentUser);
	}, [currentUser, mutate]);

	React.useEffect(() => {
		if (!open) {
			setCurrentUser(null);
		}
	}, [open]);

	const columns = React.useMemo(() => {
		const cols: Column<User>[] = [
			{
				Header: 'Username',
				accessor: 'username',
				id: 'user.username',
				Cell: ({ row }) => {
					const { username, imageUrl } = row.original;
					return (
						<>
							<HStack>
								<Avatar size="sm" name={username} src={imageUrl} />
								<Text wordBreak="break-all">{username}</Text>
							</HStack>
						</>
					);
				},
			},
			{
				Header: 'Email',
				accessor: 'email',
				id: 'user.email',
			},
			{
				Header: 'Roles',
				Cell: ({ row }: { row: Row<User> }) => {
					const { roles } = row.original;
					return (
						<>
							<Wrap>
								{(!!roles &&
									roles.map((role: Role) => {
										return (
											<React.Fragment key={role.id}>
												<WrapItem>
													<Badge rounded="full">{role.name}</Badge>
												</WrapItem>
											</React.Fragment>
										);
									})) || <Text>None</Text>}
							</Wrap>
						</>
					);
				},
			},
		];

		if (isLoggedIn) {
			cols.push({
				Header: 'Actions',
				id: 'actions',
				Cell: ({ row }: { row: Row<User> }) => {
					const { id } = row.original;
					return (
						<ButtonGroup isAttached size="xs">
							<Button
								borderRightRadius={isAdmin ? '0' : ''}
								as={Link}
								to={`users/${id}`}
								rounded="full"
								colorScheme="green"
							>
								Edit User
							</Button>
							{isAdmin && (
								<Button
									onClick={() => {
										setCurrentUser(id);
										setOpen(true);
									}}
									borderLeftRadius="0"
									rounded="full"
									colorScheme="red"
								>
									Delete User
								</Button>
							)}
						</ButtonGroup>
					);
				},
			});
		}

		return cols;
	}, [isAdmin, isLoggedIn]);

	const initialSortBy = React.useMemo(() => {
		try {
			const sortBy = JSON.parse(search.orderBy as string);
			return sortBy.map((sort: OrderByType) => {
				return {
					id: sort.field,
					desc: sort.direction === DirectionEnum.ASC ? false : true,
				};
			});
		} catch (error) {
			return [];
		}
	}, [search.orderBy]);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		state: { sortBy },
	} = useTable<User>(
		{
			columns,
			data,
			manualPagination: true,
			manualSortBy: true,
			pageCount: totalPages,
			initialState: {
				sortBy: initialSortBy,
			},
		},
		useSortBy,
		usePagination
	);

	React.useEffect(() => {
		const formatted = sortBy.map((sort) => {
			return {
				field: sort.id,
				direction: sort.desc === false ? DirectionEnum.ASC : DirectionEnum.DESC,
			};
		});
		setOrderBy(formatted);
	}, [sortBy, setOrderBy]);

	return (
		<>
			<Layout>
				<Heading size="xl" as="h1" mb="4">
					Users
				</Heading>
				<Container mb="4" maxW="container.sm" centerContent>
					<SearchComponent
						title="User Search"
						descriptionText="Search by username, or email, or by role name"
						searchHandler={changeHandler}
					/>
				</Container>
				<ResponsiveTable
					reactTableProps={getTableProps()}
					tableProps={{ variant: 'simple', colorScheme: 'red' }}
				>
					<Thead>
						{headerGroups.map((headerGroup: HeaderGroup<User>) => {
							return (
								<Tr {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map((column) => {
										return (
											<Th
												{...column.getHeaderProps(
													column.getSortByToggleProps()
												)}
											>
												<Wrap as="div">
													<WrapItem as="div">
														{column.render('Header')}
													</WrapItem>
													<WrapItem as="div">
														{column.isSorted ? (
															column.isSortedDesc ? (
																<Icon as={FaChevronDown} w={4} h={4} />
															) : (
																<Icon as={FaChevronUp} w={4} h={4} />
															)
														) : (
															''
														)}
													</WrapItem>
												</Wrap>
											</Th>
										);
									})}
								</Tr>
							);
						})}
					</Thead>
					<Tbody {...getTableBodyProps()}>
						{page.map((row) => {
							prepareRow(row);
							return (
								<Tr {...row.getRowProps()}>
									{row.cells.map((cell) => {
										return (
											<Td data-th={cell.column.Header} {...cell.getCellProps()}>
												<Text
													{...cell.column.getHeaderProps(
														cell.column.getSortByToggleProps()
													)}
													className="mobile-header"
													fontWeight="bold"
													as="span"
												>
													{cell.column.Header}:
													{cell.column.isSorted ? (
														cell.column.isSortedDesc ? (
															<Icon as={FaChevronDown} w={4} h={4} />
														) : (
															<Icon as={FaChevronUp} w={4} h={4} />
														)
													) : (
														''
													)}
												</Text>
												{cell.render('Cell')}
											</Td>
										);
									})}
								</Tr>
							);
						})}
					</Tbody>
				</ResponsiveTable>
				{totalPages > 1 && (
					<Box mb="8">
						<Paginated
							currentPage={currentPage}
							totalPage={totalPages}
							siblingsSize={2}
							boundarySize={2}
						>
							{({
								pages,
								currentPage,
								hasPrev,
								hasNext,
								getFirstBoundary,
								getLastBoundary,
								isPrevTruncated,
								isNextTruncated,
							}) => (
								<ButtonGroup
									flexWrap="wrap"
									mt="5"
									colorScheme="red"
									variant="outline"
									isAttached={true}
								>
									{hasPrev() && (
										<>
											<Button onClick={() => setPage(1)}>First</Button>
											<Button onClick={() => setPage((prev) => prev - 1)}>
												Prev
											</Button>
										</>
									)}
									{getFirstBoundary().map((boundary) => (
										<Button onClick={() => setPage(boundary)} key={boundary}>
											{boundary}
										</Button>
									))}
									{isPrevTruncated && <Button>...</Button>}
									{pages.map((page) => {
										return page === currentPage ? (
											<Button variant="solid" disabled={true} key={page}>
												{page}
											</Button>
										) : (
											<Button
												onClick={() => {
													setPage(page);
												}}
												key={page}
											>
												{page}
											</Button>
										);
									})}
									{isNextTruncated && <Button>...</Button>}
									{getLastBoundary().map((boundary) => (
										<Button onClick={() => setPage(boundary)} key={boundary}>
											{boundary}
										</Button>
									))}
									{hasNext() && (
										<>
											<Button
												onClick={() => {
													setPage((prev) => prev + 1);
												}}
											>
												Next
											</Button>
											<Button onClick={() => setPage(totalPages)}>Last</Button>
										</>
									)}
								</ButtonGroup>
							)}
						</Paginated>
					</Box>
				)}
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
