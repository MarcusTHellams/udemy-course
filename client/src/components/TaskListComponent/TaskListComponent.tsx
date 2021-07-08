import * as React from "react";
import { Task } from "../../types/task.type";
import {
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Link,
} from "@chakra-ui/react";
import { Link as RLink } from "react-router-dom";
import { DeletionVerification } from "../DeletionVerification/DeletionVerification";
import { client } from "../../graphql/client";
import { useMutation, useQueryClient } from "react-query";
import { removeTask } from "../../graphql/mutations/removeTask";
import { PaginatedResults } from "../../types/paginatedResults.type";
import { useTable, usePagination, Column, Row, HeaderGroup } from "react-table";
import { Paginated } from "@makotot/paginated";

type TaskListComponentProps = {
  paginatedTasks?: PaginatedResults<Task>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
};

export const TaskListComponent = ({
  paginatedTasks = {
    items: [],
    meta: { itemCount: 0, totalItems: 0, totalPages: 0, currentPage: 1 },
  },
  setPage,
  setLimit,
}: TaskListComponentProps): JSX.Element => {
  const {
    items,
    meta: { totalPages, currentPage },
  } = paginatedTasks;
  const [open, setOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState<string | null>();

  const data = React.useMemo(() => items, [items]);

  const columns: Column<Task>[] = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "User",
        accessor: "user",
        Cell: ({ row }: { row: Row<Task> }) => {
          const { user = null } = row.original;
          return user ? (
            <Link as={RLink} to={`/users/${user?.id}`}>
              <VStack align="start" as="dl">
                <HStack>
                  <Text as="dt" fontWeight="bold">
                    Username:
                  </Text>
                  <Text as="dd">{user?.username}</Text>
                </HStack>
                <HStack>
                  <Text as="dt" fontWeight="bold">
                    Email:
                  </Text>
                  <Text as="dd">{user?.email}</Text>
                </HStack>
              </VStack>
            </Link>
          ) : (
            <Text>None</Text>
          );
        },
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }: { row: Row<Task> }) => {
          const { id } = row.original;
          return (
            <ButtonGroup isAttached size="xs">
              <Button
                borderRightRadius="0"
                as={RLink}
                to={`tasks/${id}`}
                rounded="full"
                colorScheme="green"
              >
                Edit Task
              </Button>
              <Button
                borderLeftRadius="0"
                onClick={() => {
                  setCurrentTask(id);
                  setOpen(true);
                }}
                rounded="full"
                colorScheme="red"
              >
                Delete Task
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
    state: { pageIndex, pageSize },
  } = useTable<Task>(
    {
      columns,
      data,
      manualPagination: true,
      pageCount: totalPages,
      initialState: { pageSize: 1, pageIndex: 1 },
    },
    usePagination
  );

  const mutationFn = React.useCallback((taskId) => {
    return client.mutate({
      mutation: removeTask,
      variables: {
        id: taskId,
      },
    });
  }, []);

  const queryClient = useQueryClient();

  const { mutate } = useMutation(mutationFn, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

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
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        as="h1"
        mb="8"
      >
        Tasks
        <Button
          as={RLink}
          to="/tasks/create"
          colorScheme="green"
          rounded="full"
        >
          New Task
        </Button>
      </Heading>
      <Box overflowX="scroll">
        <Table {...getTableProps()} variant="simple" colorScheme="blackAlpha">
          <Thead>
            {headerGroups.map((headerGroup: HeaderGroup<Task>) => {
              return (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <Th {...column.getHeaderProps()}>
                        {column.render("Header")}
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
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>{" "}
      {totalPages > 1 && (
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
              mt="5"
              colorScheme="blue"
              variant="outline"
              isAttached={true}
            >
              {hasPrev() && (
                <Button onClick={() => setPage((prev) => prev - 1)}>
                  Prev
                </Button>
              )}
              {getFirstBoundary().map((boundary) => (
                <Button key={boundary}>{boundary}</Button>
              ))}
              {isPrevTruncated && <span>...</span>}
              {pages.map((page) => {
                return page === currentPage ? (
                  <Button variant="solid" disabled={true} key={page}>
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
              {isNextTruncated && <Text as="span">...</Text>}
              {getLastBoundary().map((boundary) => (
                <Button key={boundary}>{boundary}</Button>
              ))}
              {hasNext() && (
                <Button
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                >
                  Next
                </Button>
              )}
            </ButtonGroup>
          )}
        </Paginated>
      )}
      <DeletionVerification
        alertProps={{
          isCentered: true,
          closeOnOverlayClick: false,
        }}
        isOpen={open}
        {...{ onClose, onDelete }}
        title="Delete Task"
        bodyText="Are you sure you want to delete the task?"
      />
    </>
  );
};
