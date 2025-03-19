import { get as _get } from 'lodash';
import * as React from 'react';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import TextField from '@mui/material/TextField';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EyeOutlineIcon from '@mui/icons-material/Visibility';
import EyeOffOutlineIcon from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import { useState, MouseEvent } from 'react';

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

interface State {
  showPassword: boolean;
}

export const FormControlInputPassword = <T extends object>(props: PropsType<T>): JSX.Element => {
  const { id, control, label, fieldName, defaultValue, placeholder, rules, errors, autoCapitalize, multiline } =
    props;

  const [values, setValues] = useState<State>({
    showPassword: false
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
            value={String(value || '')}
            onBlur={onBlur}
            onChange={val => {
              onChange(val);
            }}
            type={values.showPassword ? 'text' : 'password'}
            error={!!_get(errors, fieldName, null)}
            variant='outlined'
            multiline={multiline}
            autoCapitalize={autoCapitalize}
            helperText={errMsg ? errMsg : null}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <KeyIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    aria-label='toggle password visibility'
                  >
                    {values.showPassword ? <EyeOutlineIcon /> : <EyeOffOutlineIcon />}
                  </IconButton>
                </InputAdornment>
              )
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
