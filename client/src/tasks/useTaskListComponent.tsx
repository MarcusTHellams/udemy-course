import { SetQueryType } from '../types/setQuery.type';
import { useToast, ButtonGroup, Button } from '@chakra-ui/react';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';
import { useMutation, useQueryClient } from 'react-query';
import { Rclient } from '../graphql/client';
import { Column, Row, usePagination, useSortBy, useTable } from 'react-table';
import { Link, useHistory } from 'react-router-dom';
import { getParsedSearch } from '../utils';
import { DirectionEnum, OrderByType } from '../types/orderBy.type';
import { Task } from '../types/task.type';
import { removeTask } from '../graphql/mutations/removeTask';
import { taskQueryKeys } from '../queryKeys/taskQueryKeys';

export const useTaskListComponent = ({
	tasks,
	setQuery,
	totalPages,
}: {
	tasks: Task[];
	setQuery: SetQueryType;
	totalPages: number;
}) => {
	const data = useMemo(() => tasks, [tasks]);

	const isAdmin = useIsAdmin();
	const [open, setOpen] = useState(false);
	const [currentTask, setCurrentTask] = React.useState<string | null>();
	const toast = useToast();
	const isLoggedIn = useIsLoggedIn();

	const changeHandler = useCallback(
		(searchTerm: string) => {
			setQuery({ search: searchTerm });
		},
		[setQuery]
	);

	const columns = React.useMemo(() => {
		const cols: Column<Task>[] = [
			{
				Header: 'Task Info',
				columns: [
					{
						Header: 'Title',
						accessor: 'title',
						id: 'task.title',
					},
					{
						Header: 'Description',
						accessor: 'description',
						id: 'task.id',
					},
				],
			},
			{
				Header: 'User',
				columns: [
					{
						Header: 'Username',
						accessor: (originalRow: Task) => {
							if (originalRow?.user) {
								return originalRow.user.username;
							} else {
								return 'None';
							}
						},
					},
					{
						Header: 'Email',
						accessor: (originalRow: Task) => {
							if (originalRow?.user) {
								return originalRow.user.email;
							} else {
								return 'None';
							}
						},
					},
				],
			},
		];
		if (isLoggedIn) {
			cols.push({
				Header: 'Actions',
				id: 'Actions',
				columns: [
					{
						Header: 'Edit/Delete',
						Cell: ({ row }: { row: Row<Task> }) => {
							const { id } = row.original;
							return (
								<ButtonGroup isAttached size="xs">
									<Button
										borderRightRadius={isAdmin ? '0' : ''}
										as={Link}
										to={`tasks/${id}`}
										rounded="full"
										colorScheme="green"
									>
										Edit Task
									</Button>
									{isAdmin && (
										<Button
											borderLeftRadius="0"
											onClick={() => {
												setCurrentTask(id);
												setOpen(true);
											}}
											rounded="full"
											colorScheme="red"
										>
											Delete Task
										</Button>
									)}
								</ButtonGroup>
							);
						},
						id: 'edit/delete',
					},
				],
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

	const tableInstance = useTable<Task>(
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

	const mutationFn = useCallback((taskId) => {
		return Rclient.request(removeTask, {
			id: taskId,
		});
	}, []);

	const queryClient = useQueryClient();

	const { mutate } = useMutation<unknown, Error, string | null | undefined>(
		mutationFn,
		{
			onSuccess: () => {
				queryClient.invalidateQueries(taskQueryKeys.lists());
				toast({
					position: 'top',
					status: 'success',
					title: 'Task Deleted',
				});
			},
			onError(error) {
				toast({
					description: error.message.split(':')[0],
					duration: null,
					isClosable: true,
					position: 'top',
					status: 'error',
					title: 'Error',
				});
			},
			onSettled: () => {
				setOpen(false);
			},
		}
	);

	const onClose = React.useCallback(() => {
		setOpen(false);
	}, []);

	const onDelete = React.useCallback(() => {
		mutate(currentTask);
	}, [currentTask, mutate]);

	useEffect(() => {
		if (!open) {
			setCurrentTask(null);
		}
	}, [open]);

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
