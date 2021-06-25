import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Task } from "../../types/task.type";
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
import omit from "lodash/omit";
import { useMutation } from "react-query";
import { client } from "../../graphql/client";
import { updateTask } from "../../graphql/mutations/updateTask";
import { Query } from "../Query/Query";
import { getUsers } from "../../graphql/queries/users";
import { UserSelect } from "../UserSelect/UserSelect";
import { User } from "../../types/user.type";
import { TaskFormValues } from "../../types/taskFormValues.type";
import { DevTool } from "@hookform/devtools";

type TaskFormProps = {
  task?: Task | null;
};

const queryFn = () => {
  return client.query({ query: getUsers }).then(({ data: { users } }) => users);
};

const queryKey = "users";

export const TaskForm = ({ task = null }: TaskFormProps): JSX.Element => {
  const { register, handleSubmit, control } = useForm<TaskFormValues>({
    defaultValues: task || {},
  });

  const mutationFn = React.useCallback((data) => {
    return client
      .mutate({
        mutation: updateTask,
        variables: {
          updateTaskInput: omit(data, ["__typename", "user"]),
        },
      })
      .then((resp) => {
        console.log("resp: ", resp);
      });
  }, []);

  const { mutate } = useMutation(mutationFn);

  const submitHandler: SubmitHandler<TaskFormValues> = (values) => {
    mutate(values);
  };
  return (
    <>
      <Layout maxW="container.sm">
        <Heading as="h1" mb="4">
          Edit Task
        </Heading>
        <form onSubmit={handleSubmit(submitHandler)}>
          <input type="hidden" {...register("id")} />
          <VStack spacing="8" align="start">
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input type="text" {...register("title")} />
            </FormControl>
            <FormControl id="description" isRequired>
              <FormLabel>Description</FormLabel>
              <Input type="text" {...register("description")} />
            </FormControl>
            <FormControl id="description" isRequired>
              <FormLabel>Description</FormLabel>
              <Query
                {...{ queryFn, queryKey }}
                render={({ data: users }) => {
                  return (
                    <>
                      <UserSelect
                        selectProps={{ isClearable: true }}
                        name="userId"
                        {...{ control }}
                        users={users as User[]}
                      />
                    </>
                  );
                }}
              />
            </FormControl>
            <Box width="full">
              <Button
                variant="outline"
                type="submit"
                colorScheme="blue"
                w="full"
              >
                Edit
              </Button>
            </Box>
          </VStack>
        </form>
      </Layout>
      {/* <DevTool control={control} /> */}
    </>
  );
};
