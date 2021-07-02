import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Task } from '../../types/task.type';
import { Layout } from '../Layout/Layout';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Box,
  Button,
  Textarea,
} from '@chakra-ui/react';
import omit from 'lodash/omit';
import { useMutation, useQueryClient } from 'react-query';
import { client } from '../../graphql/client';
import { updateTask } from '../../graphql/mutations/updateTask';
import { Query } from '../Query/Query';
import { getUsers } from '../../graphql/queries/users';
import { UserSelect } from '../UserSelect/UserSelect';
import { User } from '../../types/user.type';
import { TaskFormValues } from '../../types/taskFormValues.type';
import { DevTool } from '@hookform/devtools';
import { useHistory, useLocation } from 'react-router-dom';
import { createTask } from '../../graphql/mutations/createTask';

type TaskFormProps = {
  task?: Task | null;
};

const queryFn = () => {
  return client.query({ query: getUsers }).then(({ data: { users } }) => users);
};

const queryKey = 'users';

export const TaskForm = ({ task = null }: TaskFormProps): JSX.Element => {
  const editOrCreate = !!task ? 'Edit' : 'Create';

  const { state } = useLocation<{ referrer?: string }>();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: task || {},
  });

  const history = useHistory();
  const queryClient = useQueryClient();

  const mutationFn = React.useCallback(
    (data) => {
      return client.mutate({
        mutation: task ? updateTask : createTask,
        variables: {
          [task ? 'updateTaskInput' : 'createTaskInput']: omit(data, [
            '__typename',
            'user',
          ]),
        },
      });
    },
    [task]
  );

  const { mutate, isLoading } = useMutation(mutationFn, {
    onSuccess: () => {
      queryClient.invalidateQueries();
      if (state?.referrer) {
        history.push(state.referrer);
      } else {
        history.push('/');
      }
    },
  });

  const submitHandler: SubmitHandler<TaskFormValues> = (values) => {
    mutate(values);
  };

  return (
    <>
      <Layout maxW='container.sm'>
        <Heading as='h1' mb='4'>
          {editOrCreate} Task
        </Heading>
        <form onSubmit={handleSubmit(submitHandler)}>
          <VStack spacing='8' align='start'>
            <FormControl isInvalid={!!errors?.title}>
              <FormLabel htmlFor='title'>Title</FormLabel>
              <Input
                id='title'
                {...register('title', { required: 'Title is Required' })}
              />
              <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='description'>Description</FormLabel>
              <Textarea id='description' {...register('description')} />
            </FormControl>
            <FormControl id='description'>
              <FormLabel>User Task is Assigned to</FormLabel>
              <Query
                {...{ queryFn, queryKey }}
                render={({ data: users }) => {
                  return (
                    <>
                      <UserSelect
                        selectProps={{ isClearable: true }}
                        name='userId'
                        {...{ control }}
                        users={users as User[]}
                      />
                    </>
                  );
                }}
              />
            </FormControl>
            <Box width='full'>
              <Button
                {...{ isLoading }}
                variant='outline'
                type='submit'
                colorScheme='blue'
                w='full'
              >
                {editOrCreate}
              </Button>
            </Box>
          </VStack>
        </form>
      </Layout>
      <DevTool control={control} />
    </>
  );
};
