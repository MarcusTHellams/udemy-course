import { Heading, Spinner } from '@chakra-ui/react';
import * as React from 'react';
import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import { Layout } from '../Layout/Layout';
import BlockUi from 'react-block-ui';

interface QueryProps<T> {
  render: (
    queryResult: Omit<
      UseQueryResult<T, Error>,
      'isLoading' | 'error' | 'isError'
    >
  ) => JSX.Element;
  queryKey: QueryKey;
  queryFn: QueryFunction<T>;
  queryOptions?: UseQueryOptions<T, Error>;
}

export function Query<T>({
  render,
  queryKey,
  queryFn,
  queryOptions,
}: QueryProps<T>): JSX.Element {
  const { isLoading, isError, error, ...rest } = useQuery<T, Error>(
    queryKey,
    queryFn,
    queryOptions
  );

  if (isLoading) {
    return (
      <Layout>
        <BlockUi blocking={true} loader={<Spinner />} keepInView />
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Heading>{error?.message}</Heading>
      </Layout>
    );
  }

  return <>{render({ ...rest })}</>;
}
