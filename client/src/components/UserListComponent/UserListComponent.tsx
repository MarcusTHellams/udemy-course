import {
  Badge,
  Box,
  Heading,
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
  Icon,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Role } from '../../types/role.type';
import { User } from '../../types/user.type';
import { Layout } from '../Layout/Layout';
import { PaginatedResults } from '../../types/paginatedResults.type';
import { DirectionEnum, OrderByType } from '../../types/orderBy.type';
import {
  useTable,
  usePagination,
  Column,
  Row,
  HeaderGroup,
  useSortBy,
} from 'react-table';
import { Paginated } from '@makotot/paginated';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ResponsiveTable } from '../ResponsiveTable/ResponsiveTable';

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
  setPage,
  setLimit,
  setOrderBy,
}: UserListComponentProps): JSX.Element => {
  const {
    items,
    meta: { totalPages, currentPage },
  } = paginatedUsers;

  const data = React.useMemo(() => items, [items]);

  const columns: Column<User>[] = React.useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'username',
        id: 'user.username',
        Cell: ({ row }: { row: Row<User> }) => {
          const { username, imageUrl } = row.original;
          return (
            <>
              <HStack>
                <Avatar size='sm' name={username} src={imageUrl} />
                <Text wordBreak='break-all'>{username}</Text>
              </HStack>
            </>
          );
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        id: 'user.email'
      },
      {
        Header: 'Roles',
        // id: 'user.roles',
        Cell: ({ row }: { row: Row<User> }) => {
          const { roles } = row.original;
          return (
            <>
              <Wrap>
                {(!!roles &&
                  roles.map((role: Role) => {
                    return (
                      <React.Fragment key={role.id}>
                        <WrapItem>
                          <Badge rounded='full'>{role.name}</Badge>
                        </WrapItem>
                      </React.Fragment>
                    );
                  })) || <Text>None</Text>}
              </Wrap>
            </>
          );
        },
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }: { row: Row<User> }) => {
          const { id } = row.original;
          return (
            <ButtonGroup isAttached size='xs'>
              <Button
                borderRightRadius='0'
                as={Link}
                to={`users/${id}`}
                rounded='full'
                colorScheme='green'
              >
                Edit User
              </Button>
              <Button borderLeftRadius='0' rounded='full' colorScheme='red'>
                Delete User
              </Button>
            </ButtonGroup>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { sortBy },
  } = useTable<User>(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: true,
      pageCount: totalPages,
    },
    useSortBy,
    usePagination
  );

  React.useEffect(() => {
    const formatted = sortBy.map((sort) => {
      return {
        field: sort.id,
        direction: sort.desc === false ? DirectionEnum.ASC : DirectionEnum.DESC,
      };
    });
    setOrderBy(formatted);
  }, [sortBy, setOrderBy]);

  return (
    <>
      <Layout>
        <Heading size='xl' as='h1' mb='8'>
          Users
        </Heading>

        <ResponsiveTable
          reactTableProps={getTableProps()}
          tableProps={{ variant: 'simple', colorScheme: 'blackAlpha' }}
        >
          <Thead>
            {headerGroups.map((headerGroup: HeaderGroup<User>) => {
              return (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <Th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        <Wrap as='div'>
                          <WrapItem as='div'>
                            {column.render('Header')}
                          </WrapItem>
                          <WrapItem as='div'>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <Icon as={FaChevronDown} w={4} h={4} />
                              ) : (
                                <Icon as={FaChevronUp} w={4} h={4} />
                              )
                            ) : (
                              ''
                            )}
                          </WrapItem>
                        </Wrap>
                      </Th>
                    );
                  })}
                </Tr>
              );
            })}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td data-th={cell.column.Header} {...cell.getCellProps()}>
                         <Text
                        {...cell.column.getHeaderProps(
                          cell.column.getSortByToggleProps()
                        )}
                        className='mobile-header'
                        fontWeight='bold'
                        as='span'
                      >
                        {cell.column.Header}:
                        {cell.column.isSorted ? (
                          cell.column.isSortedDesc ? (
                            <Icon as={FaChevronDown} w={4} h={4} />
                          ) : (
                            <Icon as={FaChevronUp} w={4} h={4} />
                          )
                        ) : (
                          ''
                        )}
                      </Text>
                        {cell.render('Cell')}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </ResponsiveTable>
        {totalPages > 1 && (
          <Box mb='8'>
            <Paginated
              currentPage={currentPage}
              totalPage={totalPages}
              siblingsSize={2}
              boundarySize={2}
            >
              {({
                pages,
                currentPage,
                hasPrev,
                hasNext,
                getFirstBoundary,
                getLastBoundary,
                isPrevTruncated,
                isNextTruncated,
              }) => (
                <ButtonGroup
                  flexWrap='wrap'
                  mt='5'
                  colorScheme='blue'
                  variant='outline'
                  isAttached={true}
                >
                  {hasPrev() && (
                    <>
                      <Button onClick={() => setPage(1)}>First</Button>
                      <Button onClick={() => setPage((prev) => prev - 1)}>
                        Prev
                      </Button>
                    </>
                  )}
                  {getFirstBoundary().map((boundary) => (
                    <Button onClick={() => setPage(boundary)} key={boundary}>
                      {boundary}
                    </Button>
                  ))}
                  {isPrevTruncated && <Button>...</Button>}
                  {pages.map((page) => {
                    return page === currentPage ? (
                      <Button variant='solid' disabled={true} key={page}>
                        {page}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setPage(page);
                        }}
                        key={page}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {isNextTruncated && <Button>...</Button>}
                  {getLastBoundary().map((boundary) => (
                    <Button onClick={() => setPage(boundary)} key={boundary}>
                      {boundary}
                    </Button>
                  ))}
                  {hasNext() && (
                    <>
                      <Button
                        onClick={() => {
                          setPage((prev) => prev + 1);
                        }}
                      >
                        Next
                      </Button>
                      <Button onClick={() => setPage(totalPages)}>Last</Button>
                    </>
                  )}
                </ButtonGroup>
              )}
            </Paginated>
          </Box>
        )}
      </Layout>
    </>
  );
};
