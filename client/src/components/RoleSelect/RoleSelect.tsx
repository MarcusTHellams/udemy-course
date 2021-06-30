import * as React from 'react';
import Select, { Props } from 'react-select';
import { Role } from '../../types/role.type';
import { Controller, Control } from 'react-hook-form';
import { UserFormValues } from '../../types/userFormValues.type';

type RoleSelectProps = {
  [key: string]: any;
  roles: Role[];
  control: Control<UserFormValues>;
};

export const RoleSelect = ({
  roles,
  control,
  ...rest
}: RoleSelectProps): JSX.Element => {
  const name = 'roles';

  return (
    <>
      <Controller
        {...{ control, name }}
        render={({ field: { name, onBlur, onChange, value } }) => {
          return (
            <>
              <Select
                {...rest}
                id='name'
                {...{ name, value, onChange, onBlur }}
                isMulti
                options={roles}
                getOptionLabel={(option) => {
                  const _option = option as unknown as Role;
                  return _option.name;
                }}
                getOptionValue={(option) => {
                  const _option = option as unknown as Role;
                  return _option.id;
                }}
              />
            </>
          );
        }}
      />
    </>
  );
};
