import { QueryKeysType } from './../types/queryKey.types';
import { SetQueryType } from '../types/setQuery.type';
import { useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Rclient } from '../graphql/client';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import { useHistory } from 'react-router-dom';
import { getParsedSearch } from '../utils';
import { DirectionEnum, OrderByType } from '../types/orderBy.type';
import { DocumentNode } from 'graphql/language/ast';
import isEqual from 'lodash/isEqual';

type CurrentItem = string | null | undefined;

type UseItemListComponentType<T extends object> = {
	document: string | DocumentNode;
	items: T[];
	queryKeys: QueryKeysType;
	setQuery: SetQueryType;
	totalPages: number;
	columns: Column<T>[];
	currentPage: number;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	open: boolean;
	setCurrentItem: React.Dispatch<React.SetStateAction<CurrentItem>>;
	currentItem: CurrentItem;
};

export const useItemListComponent = <T extends object>({
	columns,
	document,
	items,
	queryKeys,
	setQuery,
	currentPage,
	totalPages,
	setOpen,
	open,
	setCurrentItem,
	currentItem,
}: UseItemListComponentType<T>) => {
	const data = useMemo(() => [...items], [items]);
	const toast = useToast();

	const changeHandler = useCallback(
		(searchTerm: string) => {
			setQuery({ search: searchTerm });
		},
		[setQuery]
	);

	const queryClient = useQueryClient();

	const { mutate } = useMutation<boolean, Error, CurrentItem>(
		async (id) => {
			return Rclient.request(document, { id }).then((response) => response);
		},
		{
			onSuccess() {
				queryClient.invalidateQueries(queryKeys.lists());
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
		mutate(currentItem);
	}, [currentItem, mutate]);

	useEffect(() => {
		if (!open) {
			setCurrentItem(null);
		}
	}, [open, setCurrentItem]);

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

	const tableInstance = useTable<T>(
		{
			columns,
			data,
			manualPagination: true,
			manualSortBy: true,
			pageCount: totalPages,
			initialState: {
				sortBy: initialSortBy,
			},
			disableMultiSort: true,
		},
		useSortBy,
		usePagination
	);

	const {
		setSortBy,
		state: { sortBy },
	} = tableInstance;

	useEffect(() => {
		try {
			const formatted = sortBy.map((sort) => {
				return {
					field: sort.id,
					direction:
						sort.desc === false ? DirectionEnum.ASC : DirectionEnum.DESC,
				};
			});
			if (
				isEqual(
					JSON.parse((getParsedSearch().orderBy as string) || '[]'),
					formatted
				)
			) {
				return;
			}
			setQuery({ orderBy: formatted });
		} catch (error) {
			if (error instanceof Error) {
				console.log(
					'🚀 ~ file: useItemListComponent.ts ~ line 148 ~ useEffect ~ error',
					error.message
				);
			}
		}
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
		const unListen = history.listen(() => {
			try {
				let { orderBy } = getParsedSearch();
				orderBy = JSON.parse(orderBy as string) as OrderByType[];
				const formatted = orderBy.map((by) => {
					return {
						id: by.field,
						desc: by.direction === DirectionEnum.DESC ? true : false,
					};
				});
				if (!isEqual(formatted, sortBy)) {
					setSortBy(formatted);
				}
			} catch (error) {
				if (error instanceof Error) {
					console.log(
						'🚀 ~ file: useItemListComponent.ts ~ line 187 ~ unListen ~ error',
						error.message
					);
				}
			}
		});

		return () => {
			unListen();
		};
	}, [history, setSortBy, sortBy]);

	useEffect(() => {
		if (currentPage > totalPages) {
			setQuery({ page: 1 }, 'replaceIn');
		}
	}, [totalPages, setQuery, currentPage]);

	return {
		changeHandler,
		onClose,
		onDelete,
		tableInstance,
		limitRef,
	};
};
