import * as React from 'react';
import { Task } from '../../types/task.type';
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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { DeletionVerification } from '../DeletionVerification/DeletionVerification';
import { client } from '../../graphql/client';
import { useMutation, useQueryClient } from 'react-query';
import { removeTask } from '../../graphql/mutations/removeTask';

type TaskListComponentProps = {
  tasks?: Task[];
};

export const TaskListComponent = ({
  tasks = [],
}: TaskListComponentProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState<string | null>();

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
      queryClient.invalidateQueries('tasks');
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
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        as='h1'
        mb='8'
      >
        Tasks
        <Button as={Link} to='/tasks/create' colorScheme='green' rounded='full'>
          New Task
        </Button>
      </Heading>
      <Box overflowX='scroll'>
        <Table variant='simple' colorScheme='blackAlpha'>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>User</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task) => {
              return (
                <React.Fragment key={task.id}>
                  <Tr>
                    <Td>{task.title}</Td>
                    <Td>{task.description}</Td>
                    <Td>
                      <VStack align='start' as='dl'>
                        <HStack>
                          <Text as='dt' fontWeight='bold'>
                            Username:
                          </Text>
                          <Text as='dd'>{task.user.username}</Text>
                        </HStack>
                        <HStack>
                          <Text as='dt' fontWeight='bold'>
                            Email:
                          </Text>
                          <Text as='dd'>{task.user.email}</Text>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td>
                      <ButtonGroup size='xs'>
                        <Button
                          as={Link}
                          to={`tasks/${task.id}`}
                          rounded='full'
                          colorScheme='green'
                        >
                          Edit Task
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentTask(task.id);
                            setOpen(true);
                          }}
                          rounded='full'
                          colorScheme='red'
                        >
                          Delete Task
                        </Button>
                      </ButtonGroup>
                    </Td>
                  </Tr>
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </Box>{' '}
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
