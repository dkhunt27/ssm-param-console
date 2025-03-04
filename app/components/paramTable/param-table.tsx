import { Breadcrumbs, Link, Typography, Stack, IconButton } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAtomValue } from 'jotai';
import { showDescriptionAtom, showLastModifiedDateAtom, showTypeAtom, pathDelimiterAtom } from '@/app/store';
import { Parameter } from '@aws-sdk/client-ssm';
import { valueIsJson } from '@/app/utils/json';
import { Copyable } from '@/app/components/copyable/copyable';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

type PropsType = {
  parameters: Parameter[];
  filterText: string;
  handleParamBreadcrumbSelect: (path: string) => void;
};

export const ParamTable = (props: PropsType): ReactElement => {
  const { parameters, filterText, handleParamBreadcrumbSelect } = props;

  const [filteredTableRows, setFilteredTableRows] = useState(parameters);

  useEffect(() => {
    if (filterText) {
      const filteredRows = parameters.filter((param) => param.Name?.includes(filterText));
      setFilteredTableRows(filteredRows);
    } else {
      setFilteredTableRows(parameters);
    }
  }, [filterText, parameters]);

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
      minWidth: 330,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const paths = params.value.split(pathDelimiter);
        const breadCrumbItems = paths.map((path: string, idx: number) => {
          const pathSoFar = paths.slice(0, idx + 1).join(pathDelimiter);
          // if last index
          if (idx === paths.length - 1) {
            return (
              <Typography sx={{ color: 'text.primary', fontWeight: 700 }} key={params.value + idx}>
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
          <Copyable value={params.value}>
            <span style={{ wordBreak: 'break-word' }}>
              <Breadcrumbs>{breadCrumbItems}</Breadcrumbs>
            </span>
          </Copyable>
        );
      },
    },
    {
      field: 'Value',
      headerName: 'Value',
      minWidth: valueWidth,
      flex: 1,
      renderCell: (params) => {
        const value = params.value as string;
        let useJsonInput = valueIsJson(value);
        if (useJsonInput) {
          return (
            <Copyable value={value}>
              <pre>{JSON.stringify(JSON.parse(value), null, 2)}</pre>
            </Copyable>
          );
        }
        return (
          <Copyable value={value}>
            <Typography sx={{ wordBreak: 'break-word' }}>{value}</Typography>
          </Copyable>
        );
      },
    },
  ];
  if (showDescription) {
    columns.push({
      field: 'Description',
      headerName: 'Description',
      minWidth: descWidth,
      flex: 1,
      renderCell: (params) => {
        const value = params.value as string;
        return value ? (
          <Copyable value={value}>
            <Typography sx={{ wordBreak: 'break-word' }}>{value}</Typography>
          </Copyable>
        ) : (
          <i>No Description</i>
        );
      },
    });
  }

  if (showType) {
    columns.push({
      field: 'Type',
      headerName: 'Type',
      minWidth: typeWidth,
      flex: 1,
    });
  }

  if (showLastModifiedDate) {
    columns.push({
      field: 'LastModifiedDate',
      headerName: 'LastModifiedDate',
      minWidth: modifiedWidth,
      flex: 1,
      sortable: true,

      renderCell: (params) => {
        const value = params.value as number | Date;
        return (
          <span>
            {<ReactTimeAgo date={value} timeStyle="round" />} ({value.toLocaleString()})
          </span>
        );
      },
    });
  }

  columns.push({
    field: 'Actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => {
      // const currentData = {
      //   name: e.Name,
      //   description: e.Description,
      //   type: e.Type,
      //   value: e.Value,
      //   kmsKey: e.KeyId,
      // };
      return (
        <Stack direction={'row'} spacing={1}>
          <IconButton aria-label="edit">
            <EditOutlinedIcon />
          </IconButton>
          <IconButton aria-label="duplicate">
            <CopyAllOutlinedIcon />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteOutlineIcon />
          </IconButton>
          {/* <CreationFormButton buttonText="Edit" modalText="Edit" initialFormData={currentData} resetOnClose editFlow />
          <CreationFormButton buttonColor="primary" buttonText="Duplicate" initialFormData={currentData} resetOnClose />
          <DeleteButton name={e.Name} onDelete={deleteParameter} /> */}
        </Stack>
      );
    },
  });

  return (
    <Stack sx={{ flexGrow: 1, width: '100%' }}>
      {!filteredTableRows && <div>Loading...</div>}
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
    </Stack>
  );
};
