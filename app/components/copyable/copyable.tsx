import { ReactElement, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Stack, Tooltip } from '@mui/material';

type PropsType = {
  value: string;
  children: ReactElement;
};

export const Copyable = (props: PropsType) => {
  const { value, children } = props;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Stack direction="row" justifyContent={'space-between'} sx={{ width: '100%' }}>
      {children}
      <Tooltip title="Copy to clipboard">
        <Button onClick={handleCopy} sx={{ minWidth: '30px' }}>
          <ContentCopyIcon sx={{ height: '15px', color: 'blueGrey' }} />
        </Button>
      </Tooltip>
    </Stack>
  );
};
