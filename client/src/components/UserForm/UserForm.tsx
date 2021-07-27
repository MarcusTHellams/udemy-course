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
} from "@chakra-ui/react";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { client } from "../../graphql/client";
import { User } from "../../types/user.type";
import { Layout } from "../Layout/Layout";
import { UserFormValues } from "../../types/userFormValues.type";
import { RoleSelect } from "../RoleSelect/RoleSelect";
import { Query } from "../Query/Query";
import { getRoles } from "../../graphql/queries/roles";
import { Role } from "../../types/role.type";
import { updateUser } from "../../graphql/mutations/user";
import { useMutation, useQueryClient } from "react-query";
import { Link, useHistory, useLocation } from "react-router-dom";
import omit from "lodash/omit";

type UserFormProps = {
  user?: User | null;
};

const queryFn = () => {
  return client.query({ query: getRoles }).then(({ data: { roles } }) => roles);
};

const queryKey = "roles";

const mutationFn = (values: any) => {
  return client.mutate({
    mutation: updateUser,
    variables: {
      updateUserInput: values,
    },
  });
};

export const UserForm = ({ user }: UserFormProps): JSX.Element => {
  const editOrCreate = !!user ? "Edit" : "Create";

  const queryClient = useQueryClient();
  const history = useHistory();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: (user && omit(user, ["tasks"])) || undefined,
  });

  const { mutate } = useMutation(mutationFn, {
    onSuccess() {
      if (user?.id) {
        queryClient.invalidateQueries(["user", user.id]);
      }
      queryClient.invalidateQueries("users");
      history.push("/users");
    },
  });

  const submitHandler: SubmitHandler<UserFormValues> = (values) => {
    mutate(values);
  };
  return (
    <>
      <Heading as="h1" mb="8">
        <Avatar shadow="2xl" name={user?.username} src={user?.imageUrl} />{" "}
        {editOrCreate} User
      </Heading>
      <form onSubmit={handleSubmit(submitHandler)}>
        <VStack spacing="8" align="start">
          <FormControl isInvalid={!!errors?.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              {...register("username", { required: "Username is Required" })}
            />
            <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors?.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              {...register("email", { required: "Email is Required" })}
            />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>
          {!user && (
            <>
              <FormControl isInvalid={!!errors?.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is Required",
                  })}
                />
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors?.passwordConfirmation}>
                <FormLabel htmlFor="passwordConfirmation">
                  PasswordConfirmation
                </FormLabel>
                <Input
                  type="password"
                  id="passwordConfirmation"
                  {...register("passwordConfirmation", {
                    required: "PasswordConfirmation is Required",
                  })}
                />
                <FormErrorMessage>
                  {errors?.passwordConfirmation?.message}
                </FormErrorMessage>
              </FormControl>
            </>
          )}
          <FormControl isInvalid={!!errors?.imageUrl}>
            <FormLabel htmlFor="imageUrl">Image Url</FormLabel>
            <Input id="imageUrl" {...register("imageUrl")} />
            <FormErrorMessage>{errors?.imageUrl?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors?.roles}>
            <FormLabel htmlFor="roles">Roles</FormLabel>
            <Query
              {...{ queryFn, queryKey }}
              render={({ data: roles }) => {
                return <RoleSelect {...{ control }} roles={roles as Role[]} />;
              }}
            />
          </FormControl>
          <Box width="full">
            <Button colorScheme="blue" variant="outline" type="submit" w="full">
              {editOrCreate}
            </Button>
          </Box>
        </VStack>
      </form>
      {user?.tasks && (
        <Table mt="4">
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
                        type="button"
                        size="xs"
                        colorScheme="green"
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
    </>
  );
};
