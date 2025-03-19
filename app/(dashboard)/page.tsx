'use client';

import * as React from 'react';
import { useSsmParam } from '@/app/hooks';
import { useEffect, useState } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import { Grid2 } from '@mui/material';
import { ParamTree } from '@/app/components/paramTree/param-tree';
import { ParamTable } from '@/app/components/paramTable/param-table';
import { ParamFilter } from '@/app/components/paramFilter/param-filter';
import { useAtomValue } from 'jotai';
import { pathDelimiterAtom, startingPathAtom } from '@/app/store';
import { stripTrailingPathDelimiter } from '@/app/utils';
import { start } from 'nprogress';

export default function DashboardPage() {
  const notifications = useNotifications();
  const pathDelimiter = useAtomValue(pathDelimiterAtom);
  const startingPath = useAtomValue(startingPathAtom);
  const [paramNames, setParamNames] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');
  const { data: parameters, error, isLoading } = useSsmParam(startingPath);

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
        if (!param.Name) {
          throw new Error(`Name not found: ${JSON.stringify(param)}`);
        }
        return param.Name;
      });
      setParamNames(names);
    }
  }, [parameters]);

  const handleSearchTreeItemSelect = (_event: React.SyntheticEvent, itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setFilterText(stripTrailingPathDelimiter(itemId, pathDelimiter));
    }
  };

  const handleParamBreadcrumbSelect = (path: string): void => {
    setFilterText(path);
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
    <Grid2 key="pageGrid" container spacing={2}>
      <Grid2 size={12}>
        <ParamFilter filterText={filterText} setFilterText={setFilterText} />
      </Grid2>
      <Grid2 size={{ xs: 4, md: 3 }}>
        <ParamTree filterText={filterText} paramNames={paramNames} handleSearchTreeItemSelect={handleSearchTreeItemSelect} />
      </Grid2>
      <Grid2 size={{ xs: 8, md: 7 }}>
        <ParamTable filterText={filterText} parameters={parameters} handleParamBreadcrumbSelect={handleParamBreadcrumbSelect} />
      </Grid2>
    </Grid2>
  );
}
