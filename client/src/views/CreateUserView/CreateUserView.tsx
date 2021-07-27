import * as React from "react";
import { Layout } from "../../components/Layout/Layout";
import { UserForm } from "../../components/UserForm/UserForm";

type CreateUserViewProps = {};

export const CreateUserView = (props: CreateUserViewProps): JSX.Element => {
  return (
    <>
      <Layout maxW="container.sm">
        <UserForm />
      </Layout>
    </>
  );
};
