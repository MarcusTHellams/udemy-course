import { Heading, Spinner } from '@chakra-ui/react';
import * as React from 'react';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { useWhyDidYouUpdate } from '../../hooks/useWhyDidYouUpdate';
import { Layout } from '../Layout/Layout';
import BlockUi from 'react-block-ui';

type QueryProps = {
  render: (queryResult: Partial<UseQueryResult>) => React.ReactNode;
  queryKey: string | Array<string | unknown>;
  queryFn: () => Promise<any>;
  queryOptions?: UseQueryOptions;
};

export const Query = ({
  render,
  queryKey,
  queryFn,
  queryOptions,
}: QueryProps): JSX.Element => {
  const { isLoading, isError, ...rest } = useQuery(
    queryKey,
    queryFn,
    queryOptions
  );
  useWhyDidYouUpdate('Query Props', {
    ...{ queryKey, queryFn, queryOptions },
  } as unknown as Record<string, string>);
  if (isLoading) {
    return (
      <Layout>
        {/* <Stack height='90vh'>
          {new Array(6).fill(1).map((_, index) => (
            <Skeleton isLoaded={!isLoading} height='15%' key={index} />
          ))}
        </Stack> */}
        <BlockUi blocking={true} loader={<Spinner />} keepInView />
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
