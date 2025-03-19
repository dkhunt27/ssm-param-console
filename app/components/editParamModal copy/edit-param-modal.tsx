import { Typography, Modal, Box } from '@mui/material';
import { Dispatch, ReactElement, SetStateAction } from 'react';

type PropsType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditParamModal = (props: PropsType): ReactElement => {
  const { open, setOpen } = props;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  );
};
