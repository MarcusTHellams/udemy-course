import * as React from 'react';
import { Task } from '../../types/task.type';
import {
  Button,
  Text,
  Heading,
  ButtonGroup,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Wrap,
  WrapItem,
  Icon,
  useToast,
  Container,
} from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';
import { DeletionVerification } from '../DeletionVerification/DeletionVerification';
import { Rclient } from '../../graphql/client';
import { useMutation, useQueryClient } from 'react-query';
import { removeTask } from '../../graphql/mutations/removeTask';
import { PaginatedResults } from '../../types/paginatedResults.type';
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
import { DirectionEnum, OrderByType } from '../../types/orderBy.type';
import { ResponsiveTable } from '../ResponsiveTable/ResponsiveTable';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { SearchComponent } from '../SearchComponent/SearchComponent';

type TaskListComponentProps = {
  paginatedTasks?: PaginatedResults<Task>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setOrderBy: React.Dispatch<React.SetStateAction<OrderByType[]>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const TaskListComponent = ({
  paginatedTasks = {
    items: [],
    meta: { itemCount: 0, totalItems: 0, totalPages: 0, currentPage: 1 },
  },
  setPage,
  setLimit,
  setOrderBy,
  setSearch,
}: TaskListComponentProps): JSX.Element => {
  const {
    items,
    meta: { totalPages, currentPage },
  } = paginatedTasks;
  const [open, setOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState<string | null>();
  const toast = useToast();
  const isLoggedIn = useIsLoggedIn();
  const isAdmin = useIsAdmin();

  const changeHandler = React.useCallback(
    (searchTerm: string) => {
      setPage(1);
      setSearch(searchTerm);
    },
    [setPage, setSearch]
  );

  const data = React.useMemo(() => items, [items]);

  const columns = React.useMemo(() => {
    const cols: Column<Task>[] = [
      {
        Header: 'Task Info',
        columns: [
          {
            Header: 'Title',
            accessor: 'title',
            id: 'task.title',
          },
          {
            Header: 'Description',
            accessor: 'description',
            id: 'task.id',
          },
        ],
      },
      {
        Header: 'User',
        columns: [
          {
            Header: 'Username',
            accessor: (originalRow: Task) => {
              if (originalRow?.user) {
                return originalRow.user.username;
              } else {
                return 'None';
              }
            },
          },
          {
            Header: 'Email',
            accessor: (originalRow: Task) => {
              if (originalRow?.user) {
                return originalRow.user.email;
              } else {
                return 'None';
              }
            },
          },
        ],
      },
    ];
    if (isLoggedIn) {
      cols.push({
        Header: 'Actions',
        id: 'Actions',
        columns: [
          {
            Header: 'Edit/Delete',
            Cell: ({ row }: { row: Row<Task> }) => {
              const { id } = row.original;
              return (
                <ButtonGroup isAttached size='xs'>
                  <Button
                    borderRightRadius={isAdmin ? '0' : ''}
                    as={RLink}
                    to={`tasks/${id}`}
                    rounded='full'
                    colorScheme='green'
                  >
                    Edit Task
                  </Button>
                  {isAdmin && (
                    <Button
                      borderLeftRadius='0'
                      onClick={() => {
                        setCurrentTask(id);
                        setOpen(true);
                      }}
                      rounded='full'
                      colorScheme='red'
                    >
                      Delete Task
                    </Button>
                  )}
                </ButtonGroup>
              );
            },
            id: 'edit/delete',
          },
        ],
      });
    }
    return cols;
  }, [isAdmin, isLoggedIn]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { sortBy },
  } = useTable<Task>(
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

  const mutationFn = React.useCallback((taskId) => {
    return Rclient.request(removeTask, {
      id: taskId,
    });
  }, []);

  const queryClient = useQueryClient();

  const { mutate } = useMutation<unknown, Error, string | null | undefined>(
    mutationFn,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        toast({
          position: 'top',
          status: 'success',
          title: 'Task Deleted',
        });
      },
      onError(error) {
        toast({
          description: error.message,
          duration: null,
          isClosable: true,
          position: 'top',
          status: 'error',
          title: 'Error',
        });
      },
      onSettled: () => {
        setOpen(false);
      },
    }
  );

  const onClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onDelete = React.useCallback(() => {
    mutate(currentTask);
  }, [currentTask, mutate]);

  React.useEffect(() => {
    if (!open) {
      setCurrentTask(null);
    }
  }, [open]);

  return (
    <>
      <Heading
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        as='h1'
        mb='8'
      >
        Tasks
        <Button
          as={RLink}
          to='/tasks/create'
          colorScheme='green'
          rounded='full'
        >
          New Task
        </Button>
      </Heading>
      <Container mb='4' maxW='container.sm' centerContent>
        <SearchComponent
          title='Task Search'
          descriptionText='Search by title, description, username, and email'
          searchHandler={changeHandler}
        />
      </Container>
      <ResponsiveTable
        reactTableProps={getTableProps()}
        tableProps={{ variant: 'simple', colorScheme: 'red' }}
      >
        <Thead>
          {headerGroups.map((headerGroup: HeaderGroup<Task>) => {
            return (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      <Wrap as='div'>
                        <WrapItem as='div'>{column.render('Header')}</WrapItem>
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
                    <Td {...cell.getCellProps()}>
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
                colorScheme='red'
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

      <DeletionVerification
        alertProps={{
          isCentered: true,
          closeOnOverlayClick: false,
        }}
        isOpen={open}
        {...{ onClose, onDelete }}
        title='Delete Task'
        bodyText='Are you sure you want to delete the task?'
      />
    </>
  );
};
