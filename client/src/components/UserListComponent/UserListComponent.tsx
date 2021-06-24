import { Flex, Heading } from '@chakra-ui/react';
import * as React from 'react';
import { User } from '../../types/user.type';
import { Card } from '../Card/Card';
import { Layout } from '../Layout/Layout';

type UserListComponentProps = {
  users: User[];
};

export const UserListComponent = ({
  users = [],
}: UserListComponentProps): JSX.Element => {
  return (
    <>
      <Layout>
        <Heading size="xl" as="h1" mb="8">
          Users
        </Heading>
        <Flex
          align={{ base: 'center', md: 'start' }}
          wrap='wrap'
          direction={{ base: 'column', md: 'row' }}
          spacing='8'
        >
          {users.map((user) => {
            return <Card key={user.id} {...{ user }} />;
          })}
        </Flex>
      </Layout>
    </>
  );
};
