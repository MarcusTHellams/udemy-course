import { Heading, Skeleton, Stack } from '@chakra-ui/react';
import * as React from 'react';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { Layout } from '../Layout/Layout';

type QueryProps = {
  render: (queryResult: Partial<UseQueryResult>) => React.ReactNode;
  queryKey: string | Array<string | unknown>;
  queryFn: () => Promise<unknown>;
  queryOptions?: UseQueryOptions;
};

export const Query = ({
  render,
  queryKey,
  queryFn,
  queryOptions = {},
}: QueryProps): JSX.Element => {
  const { isLoading, isError, ...rest } = useQuery(
    queryKey,
    queryFn,
    queryOptions
  );

  if (isLoading) {
    return (
      <Layout>
        <Stack height='90vh'>
          {new Array(6).fill(1).map((_, index) => (
            <Skeleton isLoaded={!isLoading} height='15%' key={index} />
          ))}
        </Stack>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Heading>Error</Heading>
      </Layout>
    );
  }

  return <>{render(rest)}</>;
};
