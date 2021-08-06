import { Heading, Spinner } from '@chakra-ui/react';
import * as React from 'react';
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import { Layout } from '../Layout/Layout';
import BlockUi from 'react-block-ui';

type QueryProps = {
  render: (queryResult: Partial<UseQueryResult>) => React.ReactNode;
  queryKey: string | Array<string | unknown>;
  queryFn: () => Promise<any>;
  queryOptions?: UseQueryOptions<unknown, Error, unknown, QueryKey>;
};

export const Query = ({
  render,
  queryKey,
  queryFn,
  queryOptions,
}: QueryProps): JSX.Element => {
  const { isLoading, isError, error, ...rest } = useQuery<
    unknown,
    Error,
    unknown,
    QueryKey
  >(queryKey, queryFn, queryOptions);

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

  return <>{render(rest)}</>;
};
