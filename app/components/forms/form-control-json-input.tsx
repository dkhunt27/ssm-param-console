import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import { InputLabel, Stack, TextField } from '@mui/material';
import { JsonEditor } from 'json-edit-react';
import { valueIsJson } from '@/app/utils/json';
import { on } from 'events';

type PropsType<T extends FieldValues> = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  rules?: Record<string, any>;
  control: Control<T, any>;
  /* eslint-enable @typescript-eslint/no-explicit-any*/
  id?: string;
  label: string;
  fieldName: Path<T>;
  defaultValue?: PathValue<T, Path<T>> | undefined;
};

export const FormControlJsonInput = <T extends object>(props: PropsType<T>): JSX.Element => {
  const { id, control, label, fieldName, defaultValue, rules } = props;

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        console.log('value', value);
        let useJsonInput = valueIsJson(value);

        if (useJsonInput) {
          return (
            <Stack sx={{ maxHeight: '300px' }}>
              <InputLabel id={`${id}-input-label`}>{label}</InputLabel>
              <JsonEditor
                data={JSON.parse(value)}
                onChange={({ newValue, name }) => {
                  onChange(newValue);
                  return newValue;
                }}
              />
            </Stack>
          );
        } else {
          return (
            <TextField
              id={id}
              label={label}
              fullWidth
              value={String(value || '')}
              onBlur={onBlur}
              onChange={(val) => {
                onChange(val);
              }}
              variant="outlined"
            />
          );
        }
      }}
      name={fieldName}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
