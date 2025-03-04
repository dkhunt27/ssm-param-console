import { InputAdornment, TextField } from '@mui/material';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';

type PropsType = {
  filterText: string;
  setFilterText: Dispatch<SetStateAction<string>>;
};

export const ParamFilter = (props: PropsType): ReactElement => {
  const { filterText, setFilterText } = props;

  const onFilterChange = (e: any): void => {
    const filter = e.target && e.target.value.trim();
    setFilterText(filter);
  };

  return (
    <TextField
      id="paramFilter"
      label="Parameter Filter"
      variant="outlined"
      value={filterText}
      onChange={onFilterChange}
      sx={{ width: '100%' }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <FilterAltOutlined />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
