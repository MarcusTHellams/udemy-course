import { SetQueryType } from '../types/setQuery.type';
import {
	Avatar,
	Badge,
	HStack,
	useToast,
	Wrap,
	WrapItem,
	Text,
	ButtonGroup,
	Button,
} from '@chakra-ui/react';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';
import { User } from '../types/user.type';
import { useMutation, useQueryClient } from 'react-query';
import { Rclient } from '../graphql/client';
import { removeUser } from '../graphql/mutations/user';
import { Column, Row, usePagination, useSortBy, useTable } from 'react-table';
import { Role } from '../types/role.type';
import { Link, useHistory } from 'react-router-dom';
import { getParsedSearch } from '../utils';
import { DirectionEnum, OrderByType } from '../types/orderBy.type';
import { userQueryKeys } from '.';

type CurrentUser = string | null | undefined;

export const useUserListComponent = ({
	users,
	setQuery,
	totalPages,
}: {
	users: User[];
	setQuery: SetQueryType;
	totalPages: number;
}) => {
	const data = useMemo(() => users, [users]);

	const isAdmin = useIsAdmin();
	const [open, setOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState<CurrentUser>();
	const toast = useToast();
	const isLoggedIn = useIsLoggedIn();
	const changeHandler = useCallback(
		(searchTerm: string) => {
			setQuery({ search: searchTerm });
		},
		[setQuery]
	);

	const queryClient = useQueryClient();

	const { mutate } = useMutation<boolean, Error, CurrentUser>(
		async (userId) => {
			return Rclient.request(removeUser, { id: userId }).then(
				({ removeUser }) => removeUser
			);
		},
		{
			onSuccess() {
				queryClient.invalidateQueries(userQueryKeys.lists());
			},
			onSettled() {
				setOpen(false);
			},
			onError(error) {
				toast({
					description: error?.message.split(':')[0],
					duration: null,
					isClosable: true,
					position: 'top',
					status: 'error',
					title: 'Error',
				});
			},
		}
	);

	const onClose = useCallback(() => {
		setOpen(false);
	}, []);

	const onDelete = useCallback(() => {
		mutate(currentUser);
	}, [currentUser, mutate]);

	useEffect(() => {
		if (!open) {
			setCurrentUser(null);
		}
	}, [open]);

	const columns = useMemo(() => {
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

	const initialSortBy = useMemo(() => {
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

	const tableInstance = useTable<User>(
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

	const {
		state: { sortBy },
	} = tableInstance;

	useEffect(() => {
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

	const limitRef = useRef<HTMLSelectElement | null>(null);
	const history = useHistory();

	useEffect(() => {
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

	useEffect(() => {
		if (totalPages < 2) {
			setQuery({ page: 1 }, 'replaceIn');
		}
	}, [totalPages, setQuery]);

	return {
		changeHandler,
		onClose,
		onDelete,
		tableInstance,
		open,
		limitRef,
	};
};
