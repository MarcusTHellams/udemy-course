import {
  Heading,
  Input,
  FormControl,
  FormLabel,
  VStack,
  FormErrorMessage,
  Box,
  Button,
  Avatar,
  Table,
  Th,
  Tr,
  Tbody,
  Thead,
  Td,
} from '@chakra-ui/react';
import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { client } from '../../graphql/client';
import { User } from '../../types/user.type';
import { UserFormValues } from '../../types/userFormValues.type';
import { RoleSelect } from '../RoleSelect/RoleSelect';
import { Query } from '../Query/Query';
import { getRoles } from '../../graphql/queries/roles';
import { Role } from '../../types/role.type';
import { updateUser } from '../../graphql/mutations/user';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DevTool } from '@hookform/devtools';

type UserFormProps = {
  user?: User | null;
};

const queryFn = () => {
  return client.query({ query: getRoles }).then(({ data: { roles } }) => roles);
};

const queryKey = 'roles';

const mutationFn = (values: any) => {
  return client.mutate({
    mutation: updateUser,
    variables: {
      updateUserInput: values,
    },
  });
};

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup
    .string()
    .email('A valid email is required')
    .required('Email is required'),
  password: yup.string().when('$user', (user, schema) => {
    return !user ? schema.required('Password is required') : schema;
  }),
  passwordConfirmation: yup
    .string()
    .test(
      'passwordConfirmation',
      'Password Confirmation must match password',
      (value, { parent }) => {
        if (value !== parent.password) {
          return false;
        }
        return true;
      }
    ),
  imageUrl: yup.string().url('Image Url must be a valid url'),
});

export const UserForm = ({ user }: UserFormProps): JSX.Element => {
  const editOrCreate = !!user ? 'Edit' : 'Create';

  const queryClient = useQueryClient();
  const history = useHistory();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: user || undefined,
    resolver: yupResolver(schema),
    context: { user },
    shouldUnregister: true,
  });

  const { mutate } = useMutation(mutationFn, {
    onSuccess() {
      if (user?.id) {
        queryClient.invalidateQueries(['user', user.id]);
      }
      queryClient.invalidateQueries('users');
      history.push('/users');
    },
  });

  const submitHandler: SubmitHandler<UserFormValues> = (values) => {
    mutate(values);
  };
  return (
    <>
      <Heading as='h1' mb='8'>
        <Avatar shadow='2xl' name={user?.username} src={user?.imageUrl} />{' '}
        {editOrCreate} User
      </Heading>
      <form onSubmit={handleSubmit(submitHandler)}>
        {user && <input type='hidden' {...register('id')} />}
        <VStack spacing='8' align='start'>
          <FormControl isInvalid={!!errors?.username}>
            <FormLabel htmlFor='username'>Username</FormLabel>
            <Input
              id='username'
              {...register('username', { required: 'Username is Required' })}
            />
            <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors?.email}>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input
              id='email'
              {...register('email', { required: 'Email is Required' })}
            />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>
          {!user && (
            <>
              <FormControl isInvalid={!!errors?.password}>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <Input
                  type='password'
                  id='password'
                  {...register('password', {
                    required: 'Password is Required',
                  })}
                />
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors?.passwordConfirmation}>
                <FormLabel htmlFor='passwordConfirmation'>
                  Password Confirmation
                </FormLabel>
                <Input
                  type='password'
                  id='passwordConfirmation'
                  {...register('passwordConfirmation', {
                    required: 'PasswordConfirmation is Required',
                  })}
                />
                <FormErrorMessage>
                  {errors?.passwordConfirmation?.message}
                </FormErrorMessage>
              </FormControl>
            </>
          )}
          <FormControl isInvalid={!!errors?.imageUrl}>
            <FormLabel htmlFor='imageUrl'>Image Url</FormLabel>
            <Input id='imageUrl' {...register('imageUrl')} />
            <FormErrorMessage>{errors?.imageUrl?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors?.roles}>
            <FormLabel htmlFor='roles'>Roles</FormLabel>
            <Query
              {...{ queryFn, queryKey }}
              render={({ data: roles }) => {
                return <RoleSelect {...{ control }} roles={roles as Role[]} />;
              }}
            />
          </FormControl>
          <Box width='full'>
            <Button colorScheme='blue' variant='outline' type='submit' w='full'>
              {editOrCreate}
            </Button>
          </Box>
        </VStack>
      </form>
      {user?.tasks && (
        <Table mt='4'>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {user.tasks.map((task) => {
              return (
                <React.Fragment key={task.id}>
                  <Tr>
                    <Td>{task.title}</Td>
                    <Td>{task.description}</Td>
                    <Td>
                      <Button
                        type='button'
                        size='xs'
                        colorScheme='green'
                        as={Link}
                        to={{
                          pathname: `/tasks/${task.id}`,
                          state: { referrer: location.pathname },
                        }}
                      >
                        Edit
                      </Button>
                    </Td>
                  </Tr>
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      )}
      <DevTool {...{ control }} />
    </>
  );
};
