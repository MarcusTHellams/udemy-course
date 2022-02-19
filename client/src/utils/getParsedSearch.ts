import qs from 'qs';

export type SearchKeys = 'page' | 'limit' | 'orderBy' | 'search';
export type Search = Record<SearchKeys, unknown>;

export const getParsedSearch = () => {
	const url = new URL(window.location as unknown as string);
	const search = qs.parse(url.search, { ignoreQueryPrefix: true }) as Search;
	return search;
};
