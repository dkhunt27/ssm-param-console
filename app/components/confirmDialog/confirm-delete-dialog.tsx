import { ParamType } from '@/app/types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Dispatch, SetStateAction, useState } from 'react';

type PropsType = {
  actionItem: ParamType | undefined;
  openConfirmDelete: boolean;
  setOpenConfirmDelete: Dispatch<SetStateAction<boolean>>;
  setConfirmedDelete: Dispatch<SetStateAction<boolean>>;
};

export default function ConfirmDeleteDialog(props: PropsType) {
  const { actionItem, openConfirmDelete, setOpenConfirmDelete, setConfirmedDelete } = props;

  const handleClickAgreeToDelete = () => {
    setConfirmedDelete(true);
    setOpenConfirmDelete(false);
  };

  const handleClose = () => {
    setConfirmedDelete(false);
    setOpenConfirmDelete(false);
  };

  return (
    <Dialog open={openConfirmDelete} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">{'Are you sure you?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{`Are you sure you want to delete ${actionItem?.name}.`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleClickAgreeToDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
