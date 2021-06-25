import * as React from "react";
import { User } from "../../types/user.type";
import Select , {Props} from "react-select";
import { Controller, Control } from "react-hook-form";
import { TaskFormValues } from "../../types/taskFormValues.type";
import keyBy from "lodash/keyBy";

type UserSelectProps = {
  [key: string]: any;
  users: User[];
  control: Control<TaskFormValues>;
  name:  "userId";
  selectProps?: Props
};

export const UserSelect = ({
  users,
  control,
  name,
  selectProps
}: UserSelectProps): JSX.Element => {
  const options = React.useMemo(() => {
    return users.map((user) => ({ value: user.id, label: user.username }));
  }, [users]);

  const optionsMap = React.useMemo(() => {
    return keyBy(options, (option) => option.value);
  }, [options]);

  console.log("users: ", users);
  return (
    <>
      <Controller
        {...{ control, name }}
        render={({ field: { name, onBlur, onChange, value = "" } }) => {
          return (
            <Select
              {...{ options, name, onBlur }}
              onChange={(option) => {
                onChange(option?.value);
              }}
              value={optionsMap[value]}
              {...selectProps}
            />
          );
        }}
      />
    </>
  );
};
