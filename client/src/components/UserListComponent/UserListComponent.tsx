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
	Select,
	Stack,
	FormControl,
	FormHelperText,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
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
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ResponsiveTable } from '../ResponsiveTable/ResponsiveTable';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { DeletionVerification } from '../DeletionVerification/DeletionVerification';
import { useMutation, useQueryClient } from 'react-query';
import { Rclient } from '../../graphql/client';
import { removeUser } from '../../graphql/mutations/user';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { SearchComponent } from '../SearchComponent/SearchComponent';
import { getParsedSearch } from '../../utils';
import { QueryParamConfig, SetQuery } from 'use-query-params';

type UserListComponentProps = {
	paginatedUsers?: PaginatedResults<User>;
	setQuery: SetQuery<{
		search: QueryParamConfig<string | null | undefined, string>;
		page: QueryParamConfig<number | null | undefined, number>;
		limit: QueryParamConfig<number | null | undefined, number>;
		orderBy: QueryParamConfig<
			Array<unknown> | null | undefined,
			Array<unknown>
		>;
	}>;
};

type CurrentUser = string | null | undefined;

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

	const data = React.useMemo(() => items, [items]);
	const isAdmin = useIsAdmin();
	const [open, setOpen] = React.useState(false);
	const [currentUser, setCurrentUser] = React.useState<CurrentUser>();
	const toast = useToast();
	const isLoggedIn = useIsLoggedIn();
	const changeHandler = React.useCallback(
		(searchTerm: string) => {
			setQuery({ search: searchTerm });
		},
		[setQuery]
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
			const sortBy = JSON.parse(getParsedSearch().orderBy as string);
			return sortBy.map((sort: OrderByType) => {
				return {
					id: sort.field,
					desc: sort.direction === DirectionEnum.ASC ? false : true,
				};
			});
		} catch (error) {
			return [];
		}
	}, []);

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
		if (!getParsedSearch().orderBy && !formatted.length) {
			return;
		}
		setQuery({ orderBy: formatted });
	}, [setQuery, sortBy]);

	const limitRef = React.useRef<HTMLSelectElement | null>(null);
	const history = useHistory();

	React.useEffect(() => {
		const unListen = history.listen(() => {
			const { limit } = getParsedSearch();
			if (limit) {
				if (limitRef.current) {
					limitRef.current.value = limit as string;
				}
			}

			if (!limit) {
				if (limitRef.current) {
					limitRef.current.value = '10';
				}
			}
		});

		return () => {
			unListen();
		};
	}, [history]);

	React.useEffect(() => {
		if (totalPages < 2) {
			setQuery({ page: 1 }, 'replaceIn');
		}
	}, [totalPages, setQuery]);

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
										let { orderBy = '[]' } = getParsedSearch();
										const o = JSON.parse(orderBy as string) as OrderByType[];
										const isSorted =
											column.isSorted ||
											(orderBy &&
												o.some((by) => {
													return by.field === column.id;
												}));
										const isSortedDesc =
											column.isSortedDesc ||
											(orderBy &&
												o.some((by) => {
													return (
														by.field === column.id &&
														by.direction === DirectionEnum.DESC
													);
												}));
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
														{isSorted ? (
															isSortedDesc ? (
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
				<Stack
					direction={['column', null, 'row']}
					spacing={'6'}
					my={'8'}
					alignItems={'flex-end'}
				>
					{totalPages > 1 && (
						<Box display={['none', null, null, 'block']}>
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
										flexWrap="nowrap"
										mt="5"
										colorScheme="red"
										variant="outline"
										isAttached={true}
									>
										{hasPrev() && (
											<>
												<Button onClick={() => setQuery({ page: 1 })}>
													First
												</Button>
												<Button
													onClick={() => setQuery({ page: currentPage - 1 })}
												>
													Prev
												</Button>
											</>
										)}
										{getFirstBoundary().map((boundary) => (
											<Button
												onClick={() => setQuery({ page: boundary })}
												key={boundary}
											>
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
														setQuery({ page });
													}}
													key={page}
												>
													{page}
												</Button>
											);
										})}
										{isNextTruncated && <Button>...</Button>}
										{getLastBoundary().map((boundary) => (
											<Button
												onClick={() => setQuery({ page: boundary })}
												key={boundary}
											>
												{boundary}
											</Button>
										))}
										{hasNext() && (
											<>
												<Button
													onClick={() => {
														setQuery({ page: currentPage + 1 });
													}}
												>
													Next
												</Button>
												<Button onClick={() => setQuery({ page: totalPages })}>
													Last
												</Button>
											</>
										)}
									</ButtonGroup>
								)}
							</Paginated>
						</Box>
					)}
					<FormControl display={['block', null, null, 'none']}>
						<FormHelperText>Choose a Page</FormHelperText>
						<Select
							variant={'flushed'}
							onChange={(event) => {
								setQuery({ page: parseInt(event.currentTarget.value, 10) });
							}}
							value={currentPage}
						>
							{new Array(totalPages).fill(1).map((option, index) => {
								return (
									<option value={index + 1} key={index}>
										{index + 1}
									</option>
								);
							})}
						</Select>
					</FormControl>

					<FormControl>
						<FormHelperText>Choose a Page Size</FormHelperText>
						<Select
							variant={'flushed'}
							ref={limitRef}
							size="sm"
							onInput={(event) => {
								setQuery({ limit: parseInt(event.currentTarget.value, 10) });
							}}
							defaultValue={(getParsedSearch().limit as string) || 10}
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</Select>
					</FormControl>
				</Stack>
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
