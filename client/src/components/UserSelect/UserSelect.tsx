import * as React from "react";
import { User } from "types/user.type";
import Select, { Props } from "react-select";
import { Controller, Control } from "react-hook-form";
import { TaskFormValues } from "types/taskFormValues.type";

type UserSelectProps = {
  [key: string]: any;
  users: User[];
  control: Control<TaskFormValues>;
  name: "title" | "description" | "id" | "userId" | "user";
  selectProps?: Omit<
    Props,
    | "options"
    | "getOptionLabel"
    | "getOptionValue"
    | "name"
    | "onBlur"
    | "onChange"
    | "value"
  >;
};

export const UserSelect = ({
  users,
  control,
  name,
  selectProps,
}: UserSelectProps): JSX.Element => {
  return (
    <>
      <Controller
        {...{ control, name }}
        render={({ field: { name, onBlur, onChange, value } }) => {
          const _value = value as { username: string; id: string };
          return (
            <Select
              {...{ name, onBlur, onChange }}
              value={_value}
              options={users}
              getOptionLabel={(option) => {
                return option.username;
              }}
              getOptionValue={(option) => {
                return option.id;
              }}
              {...selectProps}
            />
          );
        }}
      />
    </>
  );
};
