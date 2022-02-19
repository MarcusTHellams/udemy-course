import * as React from 'react';
import { Layout } from '../Layout/Layout';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Link,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Rclient } from '../../graphql/client';
import { login } from '../../graphql/mutations/login';
import { useMutation, MutateFunction } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';
import { useUserContext } from '../../contexts/userContext/userContext';
import { Link as RLink } from 'react-router-dom';

type LogInFormValues = {
  username: string;
  password: string;
};

const mutationFn = ({ username, password }: LogInFormValues) => {
  return Rclient.request(login, { username, password }).then(
    ({ login }) => login
  );
};

export const LogIn = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormValues>();

  const history = useHistory();
  const { setUserStorage } = useUserContext();
  const { state } = useLocation<{ referrer?: string }>();

  const { mutate, error } = useMutation<string, Error, LogInFormValues>(
    mutationFn as unknown as MutateFunction<string, Error, LogInFormValues>,
    {
      onSuccess: (data) => {
        if (setUserStorage) {
          setUserStorage(data);
        }
        if (state?.referrer) {
          history.replace(state.referrer);
        } else {
          history.goBack();
        }
      },
    }
  );

  const submitHandler: SubmitHandler<LogInFormValues> = (values) => {
    mutate(values);
  };

  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      setShowErrorAlert(true);
    } else {
      setShowErrorAlert(false);
    }
  }, [error]);

  return (
		<>
			<Layout maxW={'lg'}>
				{showErrorAlert && (
					<Alert mb="4" status="error">
						<AlertIcon />
						<AlertTitle mr={2}>Error</AlertTitle>
						<AlertDescription>{error?.message.split(':')[0]}</AlertDescription>
						<CloseButton
							onClick={() => setShowErrorAlert(false)}
							position="absolute"
							right="8px"
							top="8px"
						/>
					</Alert>
				)}
				<Heading as="h1" mb="4">
					Login
				</Heading>
				<form onSubmit={handleSubmit(submitHandler)} noValidate>
					<VStack spacing="8">
						<FormControl isRequired isInvalid={!!errors.username}>
							<FormLabel htmlFor="username">Username</FormLabel>
							<Input
								{...register('username', { required: 'Username is required' })}
								id="username"
							/>
							<FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
						</FormControl>
						<FormControl isRequired isInvalid={!!errors.password}>
							<FormLabel htmlFor="password">Password</FormLabel>
							<Input
								{...register('password', { required: 'Password is required' })}
								id="password"
								type="password"
							/>
							<FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
						</FormControl>
						<Box alignSelf="stretch">
							<Button type="submit" colorScheme="green" w="full">
								Submit
							</Button>
						</Box>
						<Text>
							Don't have an account,{' '}
							<Link color="blue.300" as={RLink} to="/signup">
								sign up here
							</Link>
						</Text>
					</VStack>
				</form>
			</Layout>
		</>
	);
};
