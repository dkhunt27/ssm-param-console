import { Typography, Modal, Stack, Divider } from '@mui/material';
import { ReactElement } from 'react';
import { ParamForm } from '../paramForm/param-form';
import { ParamType } from '@/app/types';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type PropsType = {
  open: boolean;
  modalTitle: string;
  modalParam: ParamType | undefined;
  isEdit: boolean;
  handleSave: (param: ParamType) => Promise<void>;
  handleClose: () => void;
};

export const ParamModal = (props: PropsType): ReactElement => {
  const { open, modalTitle, modalParam, isEdit, handleSave, handleClose } = props;

  return (
    <Modal title={modalTitle} open={open} onClose={handleClose}>
      <Stack spacing={2} sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h5" component="h5">
          {modalTitle}
        </Typography>
        <Divider />
        <ParamForm param={modalParam} handleClose={handleClose} handleSave={handleSave} isEdit={isEdit} />
      </Stack>
    </Modal>
  );
};
