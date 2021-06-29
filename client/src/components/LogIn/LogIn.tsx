import * as React from "react";
import { Layout } from "../Layout/Layout";
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
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { client } from "../../graphql/client";
import { login } from "../../graphql/mutations/login";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import { useUserContext } from "../../contexts/userContext/userContext";

type LogInFormValues = {
  username: string;
  password: string;
};

const mutationFn = ({ username, password }: LogInFormValues) => {
  return client
    .mutate({
      mutation: login,
      variables: {
        username,
        password,
      },
    })
    .then(({ data: { login } }) => login);
};

export const LogIn = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormValues>();

  const history = useHistory();
  const { setUserStorage } = useUserContext();

  const { mutate, error } = useMutation(mutationFn, {
    onSuccess: (data) => {
      if (setUserStorage) {
        setUserStorage(data);
      }
      history.push("/");
    },
  });

  const _error = error as { message: string };

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
      <Layout maxW={"lg"}>
        {showErrorAlert && (
          <Alert mb="4" status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Error</AlertTitle>
            <AlertDescription>{_error?.message}</AlertDescription>
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
        <form onSubmit={handleSubmit(submitHandler)}>
          <VStack spacing="8">
            <FormControl isInvalid={!!errors.username}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                {...register("username", { required: "Username is required" })}
                id="username"
              />
              <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                {...register("password", { required: "Password is required" })}
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
          </VStack>
        </form>
      </Layout>
    </>
  );
};
