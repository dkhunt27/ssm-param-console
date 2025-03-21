'use client';

import * as React from 'react';
import { useSsmParamReal } from '@/app/hooks';
import { useEffect, useState } from 'react';
import { Button, Grid2 } from '@mui/material';
import { ParamTree } from '@/app/components/paramTree/param-tree';
import { ParamTable } from '@/app/components/paramTable/param-table';
import { ParamFilter } from '@/app/components/paramFilter/param-filter';
import { useAtomValue } from 'jotai';
import { pathDelimiterAtom, startingPathAtom } from '@/app/store';
import { stripTrailingPathDelimiter } from '@/app/utils';
import { useNotifications } from '@toolpad/core/useNotifications';
import { ParamType } from '../types';
import { ParamModal } from '../components/paramModal/param-modal';
import ConfirmDeleteDialog from '../components/confirmDialog/confirm-delete-dialog';
import { Stack } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';

export default function DashboardPage() {
  const notifications = useNotifications();
  const pathDelimiter = useAtomValue(pathDelimiterAtom);
  const startingPath = useAtomValue(startingPathAtom);
  const [paramNames, setParamNames] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');
  const [actionItem, setActionItem] = useState<ParamType | undefined>();
  const [modalTitle, setModalTitle] = useState<string>('');
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [confirmedDelete, setConfirmedDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const { queryResults, saveParam, deleteParam } = useSsmParamReal(startingPath);
  const { data: parameters, error, isLoading } = queryResults;

  // if (err.message === 'Credential is missing') {
  //   console.log('Error fetching parameters', err);
  //   notifications.show('Credential error.  Did you run your aws sso login/token command?  Did it expire?', { severity: 'error' });
  // } else {
  //   console.error('Error fetching parameters', err);
  //   notifications.show('Error fetching parameters; see console;', { severity: 'error', autoHideDuration: 3000 });
  // }

  useEffect(() => {
    if (parameters) {
      const names = parameters.map((param) => {
        return param.name;
      });
      setParamNames(names);
    }
  }, [parameters]);

  useEffect(() => {
    if (confirmedDelete) {
      handleDelete(actionItem?.name || '');
    }
  }, [confirmedDelete]);

  const handleSearchTreeItemSelect = (_event: React.SyntheticEvent, itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setFilterText(stripTrailingPathDelimiter(itemId, pathDelimiter));
    }
  };

  const handleParamBreadcrumbSelect = (path: string): void => {
    setFilterText(path);
  };

  const handleNewParamClick = (): void => {
    const newParam: ParamType = {
      name: startingPath,
      type: 'String',
      value: '',
    };
    setModalTitle('Create Parameter');
    setActionItem(newParam);
    setOpen(true);
  };

  const handleEditClick = (name: string): void => {
    const found = parameters?.find((p) => p.name === name);
    if (!found) {
      console.error('handleEditClick: Could not find parameter with name:', name);
      return;
    }
    setModalTitle('Edit Parameter');
    setActionItem(found);
    setOpen(true);
    setIsEdit(true);
  };

  const handleDuplicateClick = (name: string): void => {
    const found = parameters?.find((p) => p.name === name);
    if (!found) {
      console.error('handleDuplicateClick: Could not find parameter with name:', name);
      return;
    }
    setModalTitle('Create Parameter');
    setActionItem(found);
    setOpen(true);
    setIsEdit(false);
  };

  const handleDeleteClick = async (name: string): Promise<void> => {
    const found = parameters?.find((p) => p.name === name);
    if (!found) {
      console.error('handleDeleteClick: Could not find parameter with name:', name);
      return;
    }
    setActionItem(found);
    setConfirmedDelete(false);
    setOpenConfirmDelete(true);
  };

  const handleSave = async (param: ParamType): Promise<void> => {
    await saveParam(param);
    notifications.show(`Parameter saved: ${param.name}`, { severity: 'success', autoHideDuration: 3000 });
    setModalTitle('');
    setActionItem(undefined);
    setOpen(false);
    setIsEdit(false);
  };

  const handleDelete = async (name: string): Promise<void> => {
    if (!actionItem) {
      console.error('handleDelete: actionItem is undefined');
      return;
    }
    await deleteParam(actionItem);
    notifications.show(`Parameter deleted: ${actionItem.name}`, { severity: 'success', autoHideDuration: 3000 });

    setActionItem(undefined);
    setConfirmedDelete(false);
    setOpenConfirmDelete(false);
  };

  const handleClose = (): void => {
    setModalTitle('');
    setActionItem(undefined);
    setOpen(false);
    setIsEdit(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!parameters) {
    return <div>No parameters found</div>;
  }

  return (
    <>
      <Grid2 key="pageGrid" container spacing={2}>
        <Grid2 size={12}>
          <Stack direction={'row'} spacing={2}>
            <ParamFilter filterText={filterText} setFilterText={setFilterText} />
            <Button variant="contained" sx={{ width: '175px' }} onClick={handleNewParamClick} startIcon={<AddIcon />}>
              New Param
            </Button>
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 4, md: 3 }}>
          <ParamTree startingPath={startingPath} filterText={filterText} paramNames={paramNames} handleSearchTreeItemSelect={handleSearchTreeItemSelect} />
        </Grid2>
        <Grid2 size={{ xs: 8, md: 7 }}>
          <ParamTable
            filterText={filterText}
            parameters={parameters}
            handleParamBreadcrumbSelect={handleParamBreadcrumbSelect}
            handleEditClick={handleEditClick}
            handleDuplicateClick={handleDuplicateClick}
            handleDeleteClick={handleDeleteClick}
          />
        </Grid2>
      </Grid2>
      <ParamModal modalTitle={modalTitle} modalParam={actionItem} open={open} handleSave={handleSave} handleClose={handleClose} isEdit={isEdit} />
      <ConfirmDeleteDialog
        actionItem={actionItem}
        openConfirmDelete={openConfirmDelete}
        setOpenConfirmDelete={setOpenConfirmDelete}
        setConfirmedDelete={setConfirmedDelete}
      />
    </>
  );
}
