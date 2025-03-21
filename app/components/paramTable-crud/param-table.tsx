// import { Breadcrumbs, Link, Typography, Stack, IconButton, Modal, Box } from '@mui/material';
// import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
// import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
// import { useAtomValue } from 'jotai';
// import { showDescriptionAtom, showLastModifiedDateAtom, showTypeAtom, pathDelimiterAtom } from '@/app/store';
// import { Parameter } from '@aws-sdk/client-ssm';
// import { valueIsJson } from '@/app/utils/json';
// import { Copyable } from '@/app/components/copyable/copyable';
// import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import ReactTimeAgo from 'react-time-ago';
// import JSONInput from 'react-json-editor-ajrm';
// import locale from 'react-json-editor-ajrm/locale/en';
// import { ParamForm } from '../paramForm/param-form';
// import { Crud, DataSourceCache } from '@toolpad/core/Crud';
// import { paramsDataSource } from './data-source';
// import { ParamType } from '@/app/types';
// import { useDemoRouter } from '@toolpad/core/internal';

// type PropsType = {
//   parameters: Parameter[];
//   filterText: string;
//   handleParamBreadcrumbSelect: (path: string) => void;
// };

// const modalStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// const paramsCache = new DataSourceCache();

// function matchPath(pattern: string, pathname: string): string | null {
//   const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);
//   const match = pathname.match(regex);
//   return match ? match[1] : null;
// }

// export const ParamTable = (props: PropsType): ReactElement => {
//   const { parameters, filterText, handleParamBreadcrumbSelect } = props;
//   const apiRef = useGridApiRef();
//   const router = useDemoRouter('/params');

//   const [filteredTableRows, setFilteredTableRows] = useState(parameters);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     if (filterText) {
//       const filteredRows = parameters.filter((param) => param.Name?.includes(filterText));
//       setFilteredTableRows(filteredRows);
//     } else {
//       setFilteredTableRows(parameters);
//     }
//   }, [filterText, parameters]);

//   // useEffect(() => {
//   //   if (filteredTableRows) {
//   //     console.log('autosizing columns');
//   //     apiRef.current.autosizeColumns({
//   //       includeHeaders: true,
//   //       includeOutliers: true,
//   //     });
//   //   }
//   // }, [apiRef, filteredTableRows]);

//   const pathDelimiter = useAtomValue(pathDelimiterAtom);
//   const showDescription = useAtomValue(showDescriptionAtom);
//   const showLastModifiedDate = useAtomValue(showLastModifiedDateAtom);
//   const showType = useAtomValue(showTypeAtom);

//   const descWidth = 250;
//   const typeWidth = 120;
//   const modifiedWidth = 175;
//   let valueWidth = 300;
//   valueWidth += showDescription ? 0 : descWidth;
//   valueWidth += showLastModifiedDate ? 0 : modifiedWidth;
//   valueWidth += showType ? 0 : typeWidth;

//   const columns: GridColDef<Parameter>[] = [
//     {
//       field: 'Name',
//       headerName: 'Name',
//       //minWidth: 330,
//       //flex: 1,
//       sortable: true,
//       renderCell: (params) => {
//         const paths = params.value.split(pathDelimiter);
//         const breadCrumbItems = paths.map((path: string, idx: number) => {
//           const pathSoFar = paths.slice(0, idx + 1).join(pathDelimiter);
//           // if last index
//           if (idx === paths.length - 1) {
//             return (
//               <Typography sx={{ color: 'text.primary', fontWeight: 700 }} key={params.value + idx}>
//                 {path}
//               </Typography>
//             );
//           }
//           return (
//             <Link underline="hover" color="inherit" href="#" key={params.value + idx} onClick={() => handleParamBreadcrumbSelect(pathSoFar)}>
//               {path}
//             </Link>
//           );
//         });
//         return (
//           <Copyable value={params.value}>
//             <span style={{ wordBreak: 'break-word', justifyContent: 'center', alignItems: 'center' }}>
//               <Breadcrumbs>{breadCrumbItems}</Breadcrumbs>
//             </span>
//           </Copyable>
//         );
//       },
//     },
//     {
//       field: 'Value',
//       headerName: 'Value',
//       //minWidth: valueWidth,
//       //flex: 1,
//       renderCell: (params) => {
//         const value = params.value as string;
//         let useJsonInput = valueIsJson(value);
//         if (useJsonInput) {
//           return (
//             <Copyable value={value}>
//               <JSONInput
//                 placeholder={JSON.parse(value)}
//                 viewOnly
//                 theme="light_mitsuketa_tribute"
//                 locale={locale}
//                 height="150px"
//                 width={`${valueWidth - 25}px`}
//                 confirmGood={false}
//               />
//               {/* <pre>{JSON.stringify(JSON.parse(value), null, 2)}</pre> */}
//             </Copyable>
//           );
//         }
//         return (
//           <Copyable value={value}>
//             <span style={{ wordBreak: 'break-word' }}>{value}</span>
//           </Copyable>
//         );
//       },
//     },
//     {
//       field: 'Description',
//       headerName: 'Description',
//       //minWidth: descWidth,
//       //flex: 1,
//       renderCell: (params) => {
//         const value = params.value as string;
//         return value ? (
//           <Copyable value={value}>
//             <Typography sx={{ wordBreak: 'break-word' }}>{value}</Typography>
//           </Copyable>
//         ) : (
//           <i>No Description</i>
//         );
//       },
//     },
//     {
//       field: 'Type',
//       headerName: 'Type',
//       //minWidth: typeWidth,
//       //flex: 1,
//     },
//     {
//       field: 'LastModifiedDate',
//       headerName: 'LastModifiedDate',
//       //minWidth: modifiedWidth,
//       //flex: 1,
//       sortable: true,

//       renderCell: (params) => {
//         const value = params.value as number | Date;
//         return (
//           <span>
//             {<ReactTimeAgo date={value} timeStyle="round" />} ({value.toLocaleString()})
//           </span>
//         );
//       },
//     },
//     {
//       field: 'Actions',
//       headerName: 'Actions',
//       //width: 150,
//       renderCell: (params) => {
//         // const currentData = {
//         //   name: e.Name,
//         //   description: e.Description,
//         //   type: e.Type,
//         //   value: e.Value,
//         //   kmsKey: e.KeyId,
//         // };
//         return (
//           <Stack direction={'row'} spacing={1}>
//             <IconButton aria-label="edit" onClick={() => setOpen(true)}>
//               <EditOutlinedIcon />
//             </IconButton>
//             <IconButton aria-label="duplicate">
//               <CopyAllOutlinedIcon />
//             </IconButton>
//             <IconButton aria-label="delete">
//               <DeleteOutlineIcon />
//             </IconButton>
//             {/* <CreationFormButton buttonText="Edit" modalText="Edit" initialFormData={currentData} resetOnClose editFlow />
//           <CreationFormButton buttonColor="primary" buttonText="Duplicate" initialFormData={currentData} resetOnClose />
//           <DeleteButton name={e.Name} onDelete={deleteParameter} /> */}
//           </Stack>
//         );
//       },
//     },
//   ];

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const title = useMemo(() => {
//     if (router.pathname === '/notes/new') {
//       return 'New Note';
//     }
//     const editNoteId = matchPath('/notes/:noteId/edit', router.pathname);
//     if (editNoteId) {
//       return `Note ${editNoteId} - Edit`;
//     }
//     const showNoteId = matchPath('/notes/:noteId', router.pathname);
//     if (showNoteId) {
//       return `Note ${showNoteId}`;
//     }

//     return undefined;
//   }, [router.pathname]);

//   return (
//     <Stack sx={{ flexGrow: 1, width: '100%', height: '80vh' }}>
//       {!filteredTableRows && <div>Loading...</div>}
//       {filteredTableRows && filteredTableRows.length > 0 && (
//         // <DataGrid
//         //   apiRef={apiRef}
//         //   rows={filteredTableRows}
//         //   columns={columns}
//         //   initialState={{
//         //     columns: {
//         //       columnVisibilityModel: {
//         //         Type: showType,
//         //         Description: showDescription,
//         //         LastModifiedDate: showLastModifiedDate,
//         //       },
//         //     },
//         //     pagination: {
//         //       paginationModel: {
//         //         pageSize: 5,
//         //       },
//         //     },
//         //   }}
//         //   pageSizeOptions={[5]}
//         //   checkboxSelection
//         //   disableRowSelectionOnClick
//         //   disableAutosize={false}
//         //   getRowId={(row) => row.ARN as string}
//         //   autoPageSize={true}
//         // />

//         <Crud<ParamType>
//           dataSource={paramsDataSource}
//           dataSourceCache={paramsCache}
//           rootPath="/params"
//           initialPageSize={10}
//           defaultValues={{ name: 'New param' }}
//         />
//       )}
//       {/* <Modal open={open} onClose={handleClose}>
//         <Box sx={modalStyle}>
//           <ParamForm param={} />
//         </Box>
//       </Modal> */}
//     </Stack>
//   );
// };
