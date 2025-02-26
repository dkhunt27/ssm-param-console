import { Button } from '@mui/material';
import { ReactElement } from 'react';

type PropsType = {
  data: any[];
  tableFilter: string;
};

const ParamTable = (props: PropsType): ReactElement => {
  const { data, tableFilter } = props;
  return (
    <div>
      <h1>Param Table</h1>
      <h3>Filter: {tableFilter}</h3>
    </div>
  );
};

export default ParamTable;
