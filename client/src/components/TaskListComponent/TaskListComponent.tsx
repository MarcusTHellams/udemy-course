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
import { useTable, Column, Row, HeaderGroup } from "react-table";

type TaskListComponentProps = {
  paginatedTasks?: PaginatedResults<Task>;
};

export const TaskListComponent = ({
  paginatedTasks = {
    items: [],
    meta: { itemCount: 0, totalItems: 0, totalPages: 0, currentPage: 1 },
  },
}: TaskListComponentProps): JSX.Element => {
  const { items } = paginatedTasks;
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

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
            {rows.map((row) => {
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
