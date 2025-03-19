import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import { Box, Chip, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Theme, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

type PropsType<T extends FieldValues> = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  rules?: Record<string, any>;
  control: Control<T, any>;
  /* eslint-enable @typescript-eslint/no-explicit-any*/
  id?: string;
  label: string;
  fieldName: Path<T>;
  defaultValue?: PathValue<T, Path<T>> | undefined;
  placeholder?: string | undefined;
  multiple?: boolean;
  disabled?: boolean;
  maxSelected?: number;
  selectable: string[];
};

function getStyles(item: string, selected: readonly string[], theme: Theme) {
  return {
    fontWeight: selected.indexOf(item) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  };
}

function getDisabled(item: string, selected: readonly string[]) {
  if (selected.includes(item)) {
    return false; // if selected, not disabled so can unselect if needed
  } else if (selected.includes('Any') || selected.includes('Bigger') || selected.includes('Smaller')) {
    return true; // if at or over max, disable
  } else if (selected.length >= 3) {
    return true; // if at or over max, disable
  } else {
    return false; // if not selected and under max, not disabled
  }
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export const FormControlInputSelect = <T extends object>(props: PropsType<T>): JSX.Element => {
  const theme = useTheme();
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const {
    id,
    control,
    label,
    fieldName,
    defaultValue,
    placeholder,
    rules,
    selectable,
    multiple,
    disabled,
    maxSelected
  } = props;

  useEffect(() => {
    if (maxSelected && selected.length >= maxSelected) {
      setOpen(false);
    }
  }, [selected, maxSelected]);

  useEffect(() => {
    if (defaultValue) {
      setSelected(typeof defaultValue === 'string' ? (defaultValue as string).split(',') : defaultValue);
    }
  }, [defaultValue]);

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur } }) => {
        return (
          <Stack>
            <InputLabel id={`${id}-input-label`}>{label}</InputLabel>
            <Select
              id={id}
              labelId={`${id}-label`}
              label={label}
              open={open}
              placeholder={placeholder}
              fullWidth
              value={selected}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              onBlur={onBlur}
              onChange={(event: SelectChangeEvent<typeof selected>) => {
                const {
                  target: { value }
                } = event;

                setSelected(
                  // On autofill we get a stringified value.
                  typeof value === 'string' ? value.split(',') : value
                );

                onChange(selected);
              }}
              variant='outlined'
              multiple={multiple}
              disabled={disabled}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {selectable.map(item => (
                <MenuItem
                  key={item}
                  value={item}
                  style={getStyles(item, selected, theme)}
                  disabled={getDisabled(item, selected)}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        );
      }}
      name={fieldName}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
};
