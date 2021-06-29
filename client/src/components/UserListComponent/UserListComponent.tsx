import {
  Badge,
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Role } from '../../types/role.type';
import { User } from '../../types/user.type';
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
        <Heading size='xl' as='h1' mb='8'>
          Users
        </Heading>
        <Box overflowX="scroll">
          <Table variant='simple' colorScheme='blackAlpha'>
            <Thead>
              <tr>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Roles</Th>
                <Th>Actions</Th>
              </tr>
            </Thead>
            <Tbody>
              {users.map((user: User) => {
                return (
                  <React.Fragment key={user.id}>
                    <Tr>
                      <Td>{user.username}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        {!!user.roles && (
                          <Wrap>
                            {user.roles.map((role: Role) => {
                              return (
                                <React.Fragment key={role.id}>
                                  <WrapItem>
                                    <Badge rounded='full'>{role.name}</Badge>
                                  </WrapItem>
                                </React.Fragment>
                              );
                            })}
                          </Wrap>
                        )}
                      </Td>
                      <Td>
                        <ButtonGroup size="xs">
                          <Button as={Link} to={`/users/${user.id}`} colorScheme='green'>Edit</Button>
                          <Button color='white' colorScheme='yellow'>
                            Delete
                          </Button>
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  </React.Fragment>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Layout>
    </>
  );
};
