import { usePrevious } from 'react-use';
import { OrderByType } from './../types/orderBy.type';
import { useLocation, useHistory } from 'react-router-dom';
import * as qs from 'qs';
import { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

export type SearchKeys = 'page' | 'limit' | 'orderBy' | 'search';
export type Search = Record<SearchKeys, unknown>;

export const getParsedSearch = () => {
	const url = new URL(window.location as unknown as string);
	const search = qs.parse(url.search, { ignoreQueryPrefix: true }) as Search;
	return search;
};

export const usePaginationParams = ({
	page,
	limit,
	search,
	orderBy,
	setPage,
	setLimit,
	setOrderBy,
	setSearch,
}: {
	page: number;
	limit: number;
	search: string | unknown;
	orderBy: OrderByType[];
	setPage: React.Dispatch<React.SetStateAction<number>>;
	setLimit: React.Dispatch<React.SetStateAction<number>>;
	setOrderBy: React.Dispatch<React.SetStateAction<OrderByType[]>>;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const history = useHistory();
	// console.log('history: ', history);
	const { pathname } = useLocation();

	const prevPage = usePrevious(page);
	const prevLimit = usePrevious(limit);
	const prevSearch = usePrevious(search);
	const prevOrderBy = usePrevious(orderBy);

	const updateURl = (action: 'push' | 'replace') => {
		const Search = getParsedSearch();
		Search.page = page;
		Search.search = search;
		Search.orderBy = JSON.stringify(orderBy);
		Search.limit = limit;
		history[action]({ pathname, search: qs.stringify(Search) });
	};

	useEffect(() => {
		const unlisten = history.listen(({ search }) => {
			console.log('location: ', search, page);
			const Search = qs.parse(search, { ignoreQueryPrefix: true }) as Search;
			console.log('Search: ', Search.page);
			// setPage(Number(Search.page));

			// if (Number(Search.page) !== searchParams.current.page) {
			// }
			// if (Number(Search.limit) !== searchParams.current.limit) {
			// 	setLimit(Number(Search.limit));
			// }
			// if (Search.search !== searchParams.current.search) {
			// 	setSearch(String(Search.search));
			// }
			// if (
			// 	!isEqual(
			// 		JSON.parse(Search.orderBy as string),
			// 		searchParams.current.orderBy
			// 	)
			// ) {
			// 	setOrderBy(JSON.parse(Search.orderBy as string));
			// }
		});

		return () => {
			unlisten();
		};
	}, [
		history,
		setPage,
		setLimit,
		setOrderBy,
		setSearch,
		page,
		limit,
		search,
		orderBy,
	]);

	const searchParams = useRef({
		page,
		limit,
		orderBy,
		search,
	});

	useEffect(() => {
		searchParams.current = {
			page,
			limit,
			orderBy,
			search,
		};
	});

	const updateRef = useRef(updateURl);
	useEffect(() => {
		updateRef.current = updateURl;
	});

	useEffect(() => {
		updateRef.current('replace');
	}, []);

	/*
	 *
	 * When page, search, limit, or orderBy changes, update url
	 *
	 */
	useEffect(() => {
		if (prevPage && prevPage !== page) {
			console.log('changing');
			updateRef.current('push');
		}
	}, [page, history, pathname, prevPage]);

	useEffect(() => {
		if (prevSearch) {
			updateRef.current('push');
		}
	}, [search, history, pathname, prevSearch]);

	useEffect(() => {
		if (prevOrderBy && !isEqual(prevOrderBy, orderBy)) {
			updateRef.current('push');
		}
	}, [orderBy, history, pathname, prevOrderBy]);

	useEffect(() => {
		if (prevLimit && prevLimit !== limit) {
			updateRef.current('push');
		}
	}, [limit, history, pathname, prevLimit]);
	/*
	 *
	 * When page, search, limit, or orderBy changes, update url
	 *
	 */
};
