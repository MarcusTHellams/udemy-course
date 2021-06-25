import * as React from 'react';
import { Task } from '../../types/task.type';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';
import { Button, VStack, HStack, Text, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type TaskListComponentProps = {
  tasks?: Task[];
};

export const TaskListComponent = ({
  tasks = [],
}: TaskListComponentProps): JSX.Element => {
  return (
    <>
    <Heading display="flex" justifyContent="space-between" alignItems="center" as="h1" mb="8">Tasks
      <Button as={Link} to="/tasks/create" colorScheme="green" rounded="full">New Task</Button>
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
                      <Button as={Link} to={`tasks/${task.id}`} rounded='full' colorScheme='green'>
                        Edit Task
                      </Button>
                    </Td>
                  </Tr>
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </Box>{' '}
    </>
  );
};
