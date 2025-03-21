import { Breadcrumbs, Link, Typography, Stack, IconButton, Modal, Divider, Fab, TextField, Box } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { useAtomValue } from 'jotai';
import { showDescriptionAtom, showLastModifiedDateAtom, showTypeAtom, pathDelimiterAtom } from '@/app/store';
import { valueIsJson } from '@/app/utils/json';
import { Copyable } from '@/app/components/copyable/copyable';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReactTimeAgo from 'react-time-ago';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { ParamType } from '@/app/types';

type PropsType = {
  parameters: ParamType[];
  filterText: string;
  handleParamBreadcrumbSelect: (path: string) => void;
  handleEditClick: (name: string) => void;
  handleDuplicateClick: (name: string) => void;
  handleDeleteClick: (name: string) => void;
};

export const ParamTable = (props: PropsType): ReactElement => {
  const { parameters, filterText, handleParamBreadcrumbSelect, handleEditClick, handleDuplicateClick, handleDeleteClick } = props;
  const apiRef = useGridApiRef();
  const [filteredTableRows, setFilteredTableRows] = useState(parameters);
  const [colWidthValue, setColWidthValue] = useState<number>(-1);

  useEffect(() => {
    if (filterText) {
      const filteredRows = parameters.filter((param) => param.name?.includes(filterText));
      setFilteredTableRows(filteredRows);
    } else {
      setFilteredTableRows(parameters);
    }
  }, [filterText, parameters]);

  // useEffect(() => {
  //   if (filteredTableRows) {
  //     console.log('autosizing columns');
  //     apiRef.current.autosizeColumns({
  //       includeHeaders: true,
  //       includeOutliers: true,
  //     });

  //     const col = apiRef.current.getColumn('value');
  //     console.log('col', col);
  //     setColWidthValue(col?.computedWidth || 100);
  //   }
  // }, [apiRef, filteredTableRows]);

  const pathDelimiter = useAtomValue(pathDelimiterAtom);
  const showDescription = useAtomValue(showDescriptionAtom);
  const showLastModifiedDate = useAtomValue(showLastModifiedDateAtom);
  const showType = useAtomValue(showTypeAtom);

  // min width for table 1000
  const nameWidth = 350;
  let valueWidth = 400;
  const typeWidth = 150;
  const actionWidth = 150;
  // const descWidth = 250;
  // const typeWidth = 120;
  // const modifiedWidth = 175;
  // let valueWidth = 300;
  // valueWidth += showDescription ? 0 : descWidth;
  // valueWidth += showLastModifiedDate ? 0 : modifiedWidth;
  // valueWidth += showType ? 0 : typeWidth;

  const columns: GridColDef<ParamType>[] = [
    {
      field: 'name',
      headerName: 'Name',
      // minWidth: nameWidth,
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
          <Box height={'100%'} sx={{ alignContent: 'center' }}>
            <Copyable value={params.value}>
              <span style={{ wordBreak: 'break-word', justifyContent: 'center', alignItems: 'center' }}>
                <Breadcrumbs>{breadCrumbItems}</Breadcrumbs>
              </span>
            </Copyable>
          </Box>
        );
      },
    },
    {
      field: 'value',
      headerName: 'Value',
      width: valueWidth,
      // minWidth: valueWidth,
      // flex: 0.5,
      renderCell: (params) => {
        const value = params.value as string;
        let useJsonInput = valueIsJson(value);

        // const calcWidth = colWidthValue === -1 ? valueWidth : colWidthValue;
        const calcWidth = valueWidth;
        if (useJsonInput) {
          return (
            <Copyable value={value}>
              {/* <JSONInput
                placeholder={JSON.parse(value)}
                viewOnly
                theme="light_mitsuketa_tribute"
                locale={locale}
                height="150px"
                width={`${valueWidth - 25}px`}
                confirmGood={false}
              /> */}
              <span
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  width: `${calcWidth - 25}px`,
                }}
              >
                {JSON.stringify(JSON.parse(value), null, 2)}
              </span>
            </Copyable>
          );
        }
        return (
          <Copyable value={value}>
            <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: `${calcWidth - 25}px` }}>{value}</span>
          </Copyable>
        );
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.1,
    },
    // {
    //   field: 'lastModifiedDate',
    //   headerName: 'LastModifiedDate',
    //   //minWidth: modifiedWidth,
    //   //flex: 1,
    //   sortable: true,

    //   renderCell: (params) => {
    //     const value = params.value as number | Date;
    //     return (
    //       <span>
    //         {<ReactTimeAgo date={value} timeStyle="round" />} ({value.toLocaleString()})
    //       </span>
    //     );
    //   },
    // },
    {
      field: 'Actions',
      headerName: 'Actions',
      width: actionWidth,
      renderCell: (params) => {
        return (
          <Stack direction={'row'} spacing={1} height={'100%'}>
            <IconButton onClick={() => handleEditClick(params.id as string)}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton onClick={() => handleDuplicateClick(params.id as string)}>
              <CopyAllOutlinedIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(params.id as string)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  return (
    <Stack sx={{ flexGrow: 1, width: '100%', height: '80vh' }}>
      {!filteredTableRows && <div>Loading...</div>}
      {filteredTableRows && filteredTableRows.length > 0 && (
        <DataGrid
          apiRef={apiRef}
          rows={filteredTableRows}
          columns={columns}
          initialState={{
            columns: {
              columnVisibilityModel: {
                type: showType,
                description: showDescription,
                lastModifiedDate: showLastModifiedDate,
              },
            },
          }}
          disableRowSelectionOnClick
          disableAutosize={false}
          getRowId={(row) => row.name}
          autoPageSize={true}
        />
      )}
    </Stack>
  );
};
