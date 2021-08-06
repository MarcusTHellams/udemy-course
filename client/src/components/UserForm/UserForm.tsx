import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
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
import { updateUser, createUser } from '../../graphql/mutations/user';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DevTool } from '@hookform/devtools';
import PasswordValidator from 'password-validator';
import PasswordStrengthBar from 'react-password-strength-bar';
import BlockUi from 'react-block-ui';
import { useIsAdmin } from '../../hooks/useIsAdmin';

const passwordValidator = new PasswordValidator();

passwordValidator
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces();

type UserFormProps = {
  user?: User | null;
};

const queryFn = () => {
  return client.query({ query: getRoles }).then(({ data: { roles } }) => roles);
};

const queryKey = 'roles';

const schema = yup.object().shape({
  username: yup
    .string()
    .max(45, `Username can't be more than 45 characters`)
    .min(6, 'Username is required to be a minium of 6 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('A valid email is required')
    .required('Email is required'),
  password: yup.string().when('$user', (user, schema) => {
    return !user
      ? schema
          .min(8, 'Password must be a minimum of 8 characters')
          .max(100, 'Password must not have more than 100 characters')
          .required('Password is required')
          .test(
            'passwordValidator',
            'Password must have at least one uppercase letter, lowercase letter, a minimum of 2 digits, and no spaces',
            (value: string) => {
              if (passwordValidator.validate(value)) {
                return true;
              }
              return false;
            }
          )
      : schema;
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
  const editOrCreate = !!user ? 'Edit User' : 'Sign up';

  const toast = useToast();
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  const isAdmin = useIsAdmin();

  const queryClient = useQueryClient();
  const history = useHistory();
  const location = useLocation();
  const mutationFn = React.useCallback(
    (values: any) => {
      return client
        .mutate({
          mutation: user ? updateUser : createUser,
          variables: {
            [user ? 'updateUserInput' : 'createUserInput']: values,
          },
        })
        .then(({ data }) => {
          return user ? data['updateUser'] : data['createUser'];
        });
    },
    [user]
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: user || undefined,
    resolver: yupResolver(schema),
    context: { user },
    shouldUnregister: true,
  });

  const password = watch('password');

  const { mutate, isLoading, isSuccess, error } = useMutation(mutationFn, {
    onSuccess() {
      queryClient.invalidateQueries();
      toast({
        title: user ? 'User Updated' : 'User Created',
        status: 'success',
        position: 'top',
        onCloseComplete: () => history.push('/users'),
      });
    },
  });

  React.useEffect(() => {
    if (error) {
      setShowErrorAlert(true);
    } else {
      setShowErrorAlert(false);
    }
  }, [error]);

  const _error = error as { message: string };

  const submitHandler: SubmitHandler<UserFormValues> = (values) => {
    mutate(values);
  };
  return (
    <>
      {showErrorAlert && (
        <Alert mb='4' status='error'>
          <AlertIcon />
          <AlertTitle mr={2}>Error</AlertTitle>
          <AlertDescription>{_error?.message}</AlertDescription>
          <CloseButton
            onClick={() => setShowErrorAlert(false)}
            position='absolute'
            right='8px'
            top='8px'
          />
        </Alert>
      )}
      <Heading as='h1' mb='8'>
        <Avatar shadow='2xl' name={user?.username} src={user?.imageUrl} />{' '}
        {editOrCreate}
      </Heading>
      <BlockUi blocking={isLoading || isSuccess}>
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
                  <FormHelperText mb='2'>
                    Password must have at least one uppercase letter, lowercase
                    letter, a minimum of 2 digits, and no spaces
                  </FormHelperText>
                  <Input
                    mb={!!password?.length ? '2' : '0px'}
                    type='password'
                    id='password'
                    {...register('password', {
                      required: 'Password is Required',
                    })}
                  />
                  {!!password?.length && (
                    <PasswordStrengthBar {...{ password }} />
                  )}
                  <FormErrorMessage>
                    {errors?.password?.message}
                  </FormErrorMessage>
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
            {isAdmin && (
              <FormControl isInvalid={!!errors?.roles}>
                <FormLabel htmlFor='roles'>Roles</FormLabel>
                <Query
                  {...{ queryFn, queryKey }}
                  render={({ data: roles }) => {
                    return (
                      <RoleSelect {...{ control }} roles={roles as Role[]} />
                    );
                  }}
                />
              </FormControl>
            )}
            <Box width='full'>
              <Button
                colorScheme='blue'
                variant='outline'
                type='submit'
                w='full'
              >
                {editOrCreate}
              </Button>
            </Box>
          </VStack>
        </form>
      </BlockUi>
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
