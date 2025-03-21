import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import { FormControlLabel, FormLabel, Radio, RadioGroup, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';

type PropsType<T extends FieldValues> = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  rules?: Record<string, any>;
  control: Control<T, any>;
  /* eslint-enable @typescript-eslint/no-explicit-any*/
  id?: string;
  label?: string;
  row?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  fieldName: Path<T>;
  defaultValue?: PathValue<T, Path<T>> | undefined;
  disabled?: boolean;
};

export const FormControlInputRadioGroup = <T extends object>(props: PropsType<T>): JSX.Element => {
  const { id, control, row, options, fieldName, defaultValue, rules, label } = props;
  const [selected, setSelected] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur } }) => {
        return (
          <>
            {label && <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>}
            <RadioGroup
              id={id}
              row={row}
              value={selected}
              onBlur={onBlur}
              onChange={(event: SelectChangeEvent<typeof selected>) => {
                const {
                  target: { value },
                } = event;

                console.log('value', value);

                setSelected(value as T | undefined);

                // onChange(value);
              }}
            >
              {options.map((opt) => (
                <FormControlLabel value={opt.value} control={<Radio />} label={opt.label} disabled={opt.disabled} key={`option${opt.value}`} />
              ))}
            </RadioGroup>
          </>
        );
      }}
      name={fieldName}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
