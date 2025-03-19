import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

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

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <>
            {label && <FormLabel id='demo-row-radio-buttons-group-label'>{label}</FormLabel>}
            <RadioGroup
              id={id}
              row={row}
              value={value}
              onBlur={onBlur}
              onChange={val => {
                onChange(val);
              }}
            >
              {options.map(opt => (
                <FormControlLabel
                  value={opt.value}
                  control={<Radio />}
                  label={opt.label}
                  disabled={opt.disabled}
                  key={`option${opt.value}`}
                />
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
