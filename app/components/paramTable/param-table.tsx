import { Box, Button, Breadcrumbs, Link, Typography } from '@mui/material';
import { MouseEventHandler, ReactElement, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAtomValue } from 'jotai';
import { showDescriptionAtom, showLastModifiedDateAtom, showTypeAtom, pathDelimiterAtom } from '@/app/store';
import { Parameter } from '@aws-sdk/client-ssm';

import { useDemoData } from '@mui/x-data-grid-generator';

type PropsType = {
  parameters: Parameter[];
  tableFilter: string;
  handleParamBreadcrumbSelect: (path: string) => void;
};

const ParamTable = (props: PropsType): ReactElement => {
  const { parameters, tableFilter, handleParamBreadcrumbSelect } = props;
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 1000,
    treeData: { maxDepth: 2, groupingField: 'name', averageChildren: 200 },
  });
  const [filteredTableRows, setFilteredTableRows] = useState(parameters);

  useEffect(() => {
    if (tableFilter) {
      const filteredRows = parameters.filter((param) => param.Name?.includes(tableFilter));
      setFilteredTableRows(filteredRows);
    } else {
      setFilteredTableRows(parameters);
    }
  }, [tableFilter, parameters]);

  const pathDelimiter = useAtomValue(pathDelimiterAtom);
  const showDescription = useAtomValue(showDescriptionAtom);
  const showLastModifiedDate = useAtomValue(showLastModifiedDateAtom);
  const showType = useAtomValue(showTypeAtom);

  const descWidth = 250;
  const typeWidth = 120;
  const modifiedWidth = 175;
  let valueWidth = 300;
  valueWidth += showDescription ? 0 : descWidth;
  valueWidth += showLastModifiedDate ? 0 : modifiedWidth;
  valueWidth += showType ? 0 : typeWidth;

  const columns: GridColDef<Parameter>[] = [
    {
      field: 'Name',
      headerName: 'Name',
      width: 300,
      sortable: true,
      renderCell: (params) => {
        const paths = params.value.split(pathDelimiter);
        const breadCrumbItems = paths.map((path: string, idx: number) => {
          const pathSoFar = paths.slice(0, idx + 1).join(pathDelimiter);
          // if last index
          if (idx === paths.length - 1) {
            return (
              <Typography sx={{ color: 'text.primary' }} key={params.value + idx}>
                {path}
              </Typography>
            );
          }
          return (
            <Link underline="hover" color="inherit" href="#" key={params.value + idx} onClick={() => handleParamBreadcrumbSelect(pathSoFar)}>
              {path}
            </Link>
          );
        });
        return (
          <span style={{ wordBreak: 'break-word' }}>
            <Breadcrumbs>{breadCrumbItems}</Breadcrumbs>
          </span>
        );
      },
    },
    {
      field: 'Value',
      headerName: 'Value',
      width: valueWidth,
      // render: (value: any) => {
      //   let useJsonInput = valueIsJson(value);
      //   if (useJsonInput) {
      //     return (
      //       <JSONInput
      //         placeholder={JSON.parse(value)}
      //         viewOnly
      //         theme="light_mitsuketa_tribute"
      //         locale={locale}
      //         height="150px"
      //         width={`${valueWidth - 25}px`}
      //         confirmGood={false}
      //       />
      //     );
      //   }
      //   return (
      //     <Paragraph style={{ wordBreak: 'break-word' }} copyable>
      //       {value}
      //     </Paragraph>
      //   );
      // },
    },
  ];
  if (showDescription) {
    columns.push({
      field: 'Description',
      headerName: 'Description',
      width: descWidth,
      // render: (value: any) => {
      //   return value ? (
      //     <Paragraph style={{ wordBreak: 'break-word' }} copyable>
      //       {value}
      //     </Paragraph>
      //   ) : (
      //     <i>No Description</i>
      //   );
      // },
    });
  }

  if (showType) {
    columns.push({
      field: 'Type',
      headerName: 'Type',
      width: typeWidth,
    });
  }

  if (showLastModifiedDate) {
    columns.push({
      field: 'LastModifiedDate',
      headerName: 'LastModifiedDate',
      width: modifiedWidth,
      sortable: true,
      // render: (date: number | Date) => (
      //   <span>
      //     {<ReactTimeAgo date={date} />} ({date.toLocaleString()})
      //   </span>
      // ),
    });
  }

  columns.push({
    field: 'Actions',
    headerName: 'Actions',
    width: 125,
    // fixed: 'right',
    // render: (e: any) => {
    //   const currentData = {
    //     name: e.Name,
    //     description: e.Description,
    //     type: e.Type,
    //     value: e.Value,
    //     kmsKey: e.KeyId,
    //   };
    //   return (
    //     <Layout>
    //       <CreationFormButton buttonText="Edit" modalText="Edit" initialFormData={currentData} resetOnClose editFlow />
    //       <CreationFormButton buttonColor="primary" buttonText="Duplicate" initialFormData={currentData} resetOnClose />
    //       <DeleteButton name={e.Name} onDelete={deleteParameter} />
    //     </Layout>
    //   );
    // },
  });

  return (
    <div>
      <h1>Param Table</h1>
      <h3>Filter: {tableFilter}</h3>
      <Box sx={{ height: 400, width: '100%' }}>
        {filteredTableRows && filteredTableRows.length > 0 && (
          <DataGrid
            rows={filteredTableRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            getRowId={(row) => row.ARN as string}
          />
        )}
      </Box>
    </div>
  );
};

export default ParamTable;
