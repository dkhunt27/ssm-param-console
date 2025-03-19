import { get as _get } from 'lodash';
import * as React from 'react';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import TextField from '@mui/material/TextField';

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
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  multiline?: boolean;
};

export const FormControlInputNumeric = <T extends object>(props: PropsType<T>): JSX.Element => {
  const {
    id,
    control,
    label,
    fieldName,
    defaultValue,
    placeholder,
    rules,
    errors,
    left,
    right,
    autoCapitalize,
    multiline
  } = props;

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        const errMsg = _get(errors, `${fieldName}.message`, null);

        return (
          <TextField
            id={id}
            label={label}
            placeholder={placeholder}
            fullWidth
            value={isNaN(value) ? String(value || '') : String(value)}
            onBlur={onBlur}
            onChange={val => {
              onChange(val);
            }}
            error={!!_get(errors, fieldName, null)}
            type='number'
            variant='outlined'
            multiline={multiline}
            autoCapitalize={autoCapitalize}
            helperText={errMsg ? errMsg : null}
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
