import * as React from "react";
import { Layout } from "../Layout/Layout";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Box,
  Button,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { client } from "../../graphql/client";
import { login } from "../../graphql/mutations/login";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";

type LogInFormValues = {
  username: string;
  password: string;
};

const mutationFn = ({ username, password }: LogInFormValues) => {
  return client.mutate({
    mutation: login,
    variables: {
      username,
      password,
    },
  });
};

export const LogIn = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormValues>();

  const history = useHistory();

  const { mutate } = useMutation(mutationFn, {
    onSuccess: () => {
      history.push('/')
    },
  });

  const submitHandler: SubmitHandler<LogInFormValues> = (values) => {
    console.log("values: ", values);
  };

  return (
    <>
      <Layout maxW={"sm"}>
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
