'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { useAtom } from 'jotai';
import { awsRegionAtom, startingPathAtom, pathDelimiterAtom, showDescriptionAtom, showLastModifiedDateAtom, showTypeAtom } from '@/app/store';
import { FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [awsRegion, setAwsRegion] = useAtom(awsRegionAtom);
  const [startingPath, setStartingPath] = useAtom(startingPathAtom);
  const [pathDelimiter, setPathDelimiter] = useAtom(pathDelimiterAtom);
  const [showDescription, setShowDescription] = useAtom(showDescriptionAtom);
  const [showLastModifiedDate, setShowLastModifiedDate] = useAtom(showLastModifiedDateAtom);
  const [showType, setShowType] = useAtom(showTypeAtom);
  const [showDescriptionLabel, setShowDescriptionLabel] = useState('');
  const [showLastModifiedDateLabel, setShowLastModifiedDateLabel] = useState('');
  const [showTypeLabel, setShowTypeLabel] = useState('');

  useEffect(() => {
    if (showDescription) {
      setShowDescriptionLabel('Showing Param Description');
    } else {
      setShowDescriptionLabel('Hiding Param Description');
    }
  }, [showDescription]);

  useEffect(() => {
    if (showLastModifiedDate) {
      setShowLastModifiedDateLabel('Showing Param Last Modified Date');
    } else {
      setShowLastModifiedDateLabel('Hiding Param Last Modified Date');
    }
  }, [showLastModifiedDate]);

  useEffect(() => {
    if (showType) {
      setShowTypeLabel('Showing Param Type');
    } else {
      setShowTypeLabel('Hiding Param Type');
    }
  }, [showType]);

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField value={awsRegion} onChange={(event) => setAwsRegion(event.target.value)} label="AWS Region" />
        <Button onClick={() => setAwsRegion('')}>Clear</Button>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField value={startingPath} onChange={(event) => setStartingPath(event.target.value)} label="Parameters Starting Path" />
        <Button onClick={() => setStartingPath('')}>Clear</Button>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField value={pathDelimiter} onChange={(event) => setPathDelimiter(event.target.value)} label="Parameter Path Delimiter" />
        <Button onClick={() => setPathDelimiter('')}>Clear</Button>
      </Stack>
      <Stack direction="row" spacing={2}>
        <FormControlLabel
          control={<Switch checked={showDescription} onChange={(event) => setShowDescription(event.target.checked)} />}
          label={showDescriptionLabel}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <FormControlLabel
          control={<Switch checked={showLastModifiedDate} onChange={(event) => setShowLastModifiedDate(event.target.checked)} />}
          label={showLastModifiedDateLabel}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <FormControlLabel control={<Switch checked={showType} onChange={(event) => setShowType(event.target.checked)} />} label={showTypeLabel} />
      </Stack>
    </Stack>
  );
}
