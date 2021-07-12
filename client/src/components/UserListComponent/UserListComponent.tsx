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
  Avatar,
  HStack,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { Link } from "react-router-dom";
import { Role } from "../../types/role.type";
import { User } from "../../types/user.type";
import { Layout } from "../Layout/Layout";
import { PaginatedResults } from "../../types/paginatedResults.type";
import { DirectionEnum, OrderByType } from "../../types/orderBy.type";

type UserListComponentProps = {
  paginatedUsers?: PaginatedResults<User>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setOrderBy: React.Dispatch<React.SetStateAction<OrderByType[]>>;
};

export const UserListComponent = ({
  paginatedUsers = {
    items: [],
    meta: { itemCount: 0, totalItems: 0, totalPages: 0, currentPage: 1 },
  },
}: UserListComponentProps): JSX.Element => {
  return (
    <>
      <Layout>
        <Heading size="xl" as="h1" mb="8">
          Users
        </Heading>
        <Box overflowX="scroll">
          <Table variant="simple" colorScheme="blackAlpha">
            <Thead>
              <tr>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Roles</Th>
                <Th>Actions</Th>
              </tr>
            </Thead>
            <Tbody>
              {paginatedUsers.items.map((user: User) => {
                return (
                  <React.Fragment key={user.id}>
                    <Tr>
                      <Td>
                        <HStack>
                          <Avatar size="sm" name={user.username} src={user.imageUrl} />
                          <Text as="span">{user.username}</Text>
                        </HStack>
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>
                        {!!user.roles && (
                          <Wrap>
                            {user.roles.map((role: Role) => {
                              return (
                                <React.Fragment key={role.id}>
                                  <WrapItem>
                                    <Badge rounded="full">{role.name}</Badge>
                                  </WrapItem>
                                </React.Fragment>
                              );
                            })}
                          </Wrap>
                        )}
                      </Td>
                      <Td>
                        <ButtonGroup size="xs">
                          <Button
                            as={Link}
                            to={`/users/${user.id}`}
                            colorScheme="green"
                          >
                            Edit
                          </Button>
                          <Button color="white" colorScheme="yellow">
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
