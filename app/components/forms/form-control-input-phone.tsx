import { get as _get } from 'lodash';
import * as React from 'react';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';

import MuiPhoneNumber from 'material-ui-phone-number';

type PropsType<T extends FieldValues> = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  rules?: Record<string, any>;
  errors: any;
  control: Control<T, any>;
  /* eslint-enable @typescript-eslint/no-explicit-any*/
  id?: string;
  label: string;
  fieldName: Path<T>;
  defaultValue?: PathValue<T, Path<T>> | undefined;
  placeholder?: string | undefined;
  left?: React.ReactNode;
  right?: React.ReactNode;

  // mui phone number
};

export const FormControlInputPhone = <T extends object>(props: PropsType<T>): JSX.Element => {
  const { id, control, label, fieldName, defaultValue, placeholder, rules, errors, left, right } = props;

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        const errMsg = _get(errors, `${fieldName}.message`, null);

        return (
          <MuiPhoneNumber
            id={id}
            label={label}
            placeholder={placeholder}
            fullWidth
            value={value}
            onBlur={onBlur}
            onChange={val => {
              onChange(val);
            }}
            error={!!_get(errors, fieldName, null)}
            variant='outlined'
            helperText={errMsg ? errMsg : null}
            defaultCountry={'us'}
            onlyCountries={['us', 'ca']}
            disableCountryCode={true}
            disableDropdown={true}
            InputProps={{
              startAdornment: left,
              endAdornment: right
            }}
          />
        );
      }}
      name={fieldName}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
