'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useAtom } from 'jotai';
import { pathDelimiterAtom } from '@/app/store';

export default function SettingsPage() {
  // preview-start
  const [pathDelimiter, setPathDelimiter] = useAtom(pathDelimiterAtom);
  // preview-end
  return (
    <Stack direction="row" spacing={2}>
      <TextField value={pathDelimiter} onChange={(event) => setPathDelimiter(event.target.value)} placeholder="Param path delimiter" />
      <Button onClick={() => setPathDelimiter('')}>Clear</Button>
    </Stack>
  );
}
