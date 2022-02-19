import React, { createContext, PropsWithChildren } from 'react';
import { SetQuery, QueryParamConfig } from 'use-query-params';

export type UserListPageContextType = {
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

const { Provider } = createContext<UserListPageContextType | undefined>(
	undefined
);

type UserListPageContextProviderType = {
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

export const UserListPageContextProvider = ({
	children,
	setQuery,
}: PropsWithChildren<UserListPageContextProviderType>) => {
	return <Provider value={{ setQuery }}>{children}</Provider>;
};
