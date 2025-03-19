import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import { Stack, Switch, Typography } from '@mui/material';

type PropsType<T extends FieldValues> = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  rules?: Record<string, any>;
  control: Control<T, any>;
  /* eslint-enable @typescript-eslint/no-explicit-any*/
  id?: string;
  labelLeft?: string;
  labelLeftWhenFalse?: string;
  labelLeftWhenTrue?: string;
  labelRight?: string;
  labelRightWhenFalse?: string;
  labelRightWhenTrue?: string;
  colorNotSelected?: string;
  colorSelected?: string;
  colorSwitch?: 'error' | 'secondary' | 'primary' | 'info' | 'success' | 'warning' | 'default';
  fieldName: Path<T>;
  defaultValue?: PathValue<T, Path<T>> | undefined;
  disabled?: boolean;
};

export const FormControlInputSwitch = <T extends object>(props: PropsType<T>): JSX.Element => {
  const {
    id,
    control,
    labelLeft,
    labelLeftWhenFalse,
    labelLeftWhenTrue,
    labelRight,
    labelRightWhenFalse,
    labelRightWhenTrue,
    colorNotSelected,
    colorSelected,
    colorSwitch,
    fieldName,
    defaultValue,
    rules,
    disabled
  } = props;

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        const hasLeftLabel = labelLeft || labelLeftWhenFalse || labelLeftWhenTrue;
        const leftLabelText = labelLeft ? labelLeft : value ? labelLeftWhenTrue : labelLeftWhenFalse;
        const hasRightLabel = labelRight || labelLeftWhenFalse || labelLeftWhenTrue;
        const rightLabelText = labelRight ? labelRight : value ? labelRightWhenTrue : labelRightWhenFalse;

        let useColorNotSelected = undefined;
        let useColorSelected = undefined;
        if (colorSelected || colorNotSelected) {
          useColorNotSelected = disabled ? colorNotSelected : !value ? colorSelected : colorNotSelected;
          useColorSelected = disabled ? colorNotSelected : value ? colorSelected : colorNotSelected;
        }

        const fontWeightNotSelected = disabled ? 250 : !value ? 750 : 250;
        const fontWeightSelected = disabled ? 250 : value ? 750 : 250;

        return (
          <Stack direction='row' spacing={1} alignItems='center' justifyContent={'center'}>
            {hasLeftLabel && (
              <Typography color={useColorNotSelected} fontWeight={fontWeightNotSelected}>
                {leftLabelText}
              </Typography>
            )}
            <Switch
              id={id}
              checked={!!value}
              onBlur={onBlur}
              onChange={val => {
                onChange(val);
              }}
              color={colorSwitch ? colorSwitch : undefined}
              disabled={disabled}
            />
            {hasRightLabel && (
              <Typography color={useColorSelected} fontWeight={fontWeightSelected}>
                {rightLabelText}
              </Typography>
            )}
          </Stack>
        );
      }}
      name={fieldName}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
