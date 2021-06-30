import {
  Heading,
  Input,
  FormControl,
  FormLabel,
  VStack,
  FormErrorMessage,
  Box,
  Button,
} from '@chakra-ui/react';
import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { client } from '../../graphql/client';
import { User } from '../../types/user.type';
import { Layout } from '../Layout/Layout';
import { UserFormValues } from '../../types/userFormValues.type';
import omit from 'lodash/omit';
import { RoleSelect } from '../RoleSelect/RoleSelect';
import { Query } from '../Query/Query';
import { getRoles } from '../../graphql/queries/roles';
import { Role } from '../../types/role.type';

type UserFormProps = {
  user?: User | null;
};

const queryFn = () => {
  return client.query({ query: getRoles }).then(({ data: { roles } }) => roles);
};

const queryKey = 'roles';

export const UserForm = ({ user }: UserFormProps): JSX.Element => {
  const editOrCreate = !!user ? 'Edit' : 'Create';

  const defaultValues = React.useMemo(() => {
    if (user) {
      return omit(user, ['roles', 'tasks']);
    } else {
      return {};
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: user || {}
  });

  const submitHandler: SubmitHandler<UserFormValues> = (values) => {
    console.log(values);
  };
  return (
    <>
      <Layout maxW='container.sm'>
        <Heading as='h1' mb='8'>
          {editOrCreate} User
        </Heading>
        <form onSubmit={handleSubmit(submitHandler)}>
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
            <FormControl isInvalid={!!errors?.imageUrl}>
              <FormLabel htmlFor='imageUrl'>Image Url</FormLabel>
              <Input id='imageUrl' {...register('imageUrl')} />
              <FormErrorMessage>{errors?.imageUrl?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors?.roles}>
              <FormLabel htmlFor='roles'>Roles</FormLabel>
              <Query
                {...{ queryFn, queryKey }}
                render={({data: roles}) => {
                  return <RoleSelect {...{ control }} roles={roles as Role[]} />;
                }}
              />
            </FormControl>
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
      </Layout>
    </>
  );
};
