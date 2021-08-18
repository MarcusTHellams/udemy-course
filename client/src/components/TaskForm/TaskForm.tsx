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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { Rclient } from "../../graphql/client";
import { updateTask } from "../../graphql/mutations/updateTask";
import { Query } from "../Query/Query";
import { getUsers } from "../../graphql/queries/users";
import { UserSelect } from "../UserSelect/UserSelect";
import { User } from "../../types/user.type";
import { TaskFormValues } from "../../types/taskFormValues.type";
import { DevTool } from "@hookform/devtools";
import { useHistory, useLocation } from "react-router-dom";
import { createTask } from "../../graphql/mutations/createTask";
import { PaginatedResults } from "../../types/paginatedResults.type";
import BlockUi from "react-block-ui";

type TaskFormProps = {
  task?: Task | null;
};

const queryFn = () => {
  return Rclient.request(getUsers, {
    pageQueryInput: { page: 1, limit: 1000000 },
  }).then(({ users }) => users);
};

const queryKey = "users";

export const TaskForm = ({ task = null }: TaskFormProps): JSX.Element => {
  const editOrCreate = !!task ? "Edit" : "Create";

  const toast = useToast();

  const { state } = useLocation<{ referrer?: string }>();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: task || {},
    shouldUnregister: true,
  });

  // const userId = watch("userId");
  // const userIdRef = React.useRef(userId);
  const taskRef = React.useRef(task);

  // React.useEffect(() => {
  //   if (!userIdRef.current && taskRef?.current?.user) {
  //     setValue("userId", taskRef.current.user.id);
  //   }
  // }, [setValue]);

  const history = useHistory();
  const queryClient = useQueryClient();

  const mutationFn = React.useCallback(
    (data) => {
      return Rclient.request(task ? updateTask : createTask, {
        [task ? "updateTaskInput" : "createTaskInput"]: data,
      });
    },
    [task]
  );

  const { mutate, isLoading, isSuccess } = useMutation<
    unknown,
    Error,
    TaskFormValues
  >(mutationFn, {
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        onCloseComplete: () => {
          if (state?.referrer) {
            history.push(state.referrer);
          } else {
            history.push("/");
          }
        },
        position: "top",
        status: "success",
        title: !!task ? "Task Update" : "Task Created",
      });
    },
    onError(error) {
      toast({
        description: error.message,
        duration: null,
        isClosable: true,
        position: "top",
        status: "error",
        title: "Error",
      });
    },
  });

  const submitHandler: SubmitHandler<TaskFormValues> = (values) => {
    mutate(values);
  };

  return (
    <>
      <Layout maxW="container.sm">
        <Heading as="h1" mb="4">
          {editOrCreate} Task
        </Heading>
        <BlockUi blocking={isLoading || isSuccess}>
          <form onSubmit={handleSubmit(submitHandler)}>
            {!!task && <input type="hidden" {...register("id")} />}
            <VStack spacing="8" align="start">
              <FormControl isInvalid={!!errors?.title}>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  id="title"
                  {...register("title", { required: "Title is Required" })}
                />
                <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea id="description" {...register("description")} />
              </FormControl>
              <FormControl id="description">
                <FormLabel>User Task is Assigned to</FormLabel>
                <Query
                  {...{ queryFn, queryKey }}
                  render={({ data }) => {
                    const { items } = data as PaginatedResults<User>;
                    return (
                      <>
                        <UserSelect
                          selectProps={{ isClearable: true }}
                          name="user"
                          {...{ control }}
                          users={items}
                        />
                      </>
                    );
                  }}
                />
              </FormControl>
              <Box width="full">
                <Button
                  {...{ isLoading }}
                  variant="outline"
                  type="submit"
                  colorScheme="blue"
                  w="full"
                >
                  {editOrCreate}
                </Button>
              </Box>
            </VStack>
          </form>
        </BlockUi>
      </Layout>
      <DevTool control={control} />
    </>
  );
};
