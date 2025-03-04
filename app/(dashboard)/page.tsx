'use client';

import * as React from 'react';
import { Parameter } from '@aws-sdk/client-ssm';
import { useSsmParam } from '@/app/hooks';
import { MouseEventHandler, useEffect, useState } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import { Grid2 } from '@mui/material';
import { ParamTree } from '@/app/components/paramTree/param-tree';
import { ParamTable } from '@/app/components/paramTable/param-table';
import { ParamFilter } from '@/app/components/paramFilter/param-filter';
import { useAtomValue } from 'jotai';
import { pathDelimiterAtom } from '@/app/store';
import { stripTrailingPathDelimiter } from '@/app/utils';

export default function DashboardPage() {
  const notifications = useNotifications();
  const pathDelimiter = useAtomValue(pathDelimiterAtom);
  const { getParameters, describeParameters } = useSsmParam();
  const [parametersErrored, setParametersErrored] = useState(false);
  const [parametersLoaded, setParametersLoaded] = useState(false);
  const [parametersLoading, setParametersLoading] = useState(false);
  const [paramNames, setParamNames] = useState<string[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    setParametersLoading(true);
    setParametersLoaded(false);
    describeParameters()
      .then((data) => {
        const names = data.map((param) => param.Name) as string[];
        setParamNames(names);
        notifications.show('Parameters fetched', { severity: 'success', autoHideDuration: 3000 });
        // will trigger the paramNames/getParameters useEffect
      })
      .catch((err) => {
        console.log('Error fetching parameters', err);
        notifications.show('Error fetching parameters', { severity: 'error', autoHideDuration: 3000 });
        setParametersErrored(true);
        setParametersLoading(false);
        setParametersLoaded(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paramNames.length > 0) {
      getParameters(paramNames)
        .then((getRes) => {
          setParameters(getRes);
          console.log('Parameters loaded', getRes);
          notifications.show('Parameters loaded', { severity: 'success', autoHideDuration: 3000 });
          setParametersLoaded(true);
        })
        .catch((err) => {
          console.log('Error loading parameters', err);
          notifications.show('Error loading parameters', { severity: 'error', autoHideDuration: 3000 });
          setParametersErrored(true);
          setParametersLoaded(false);
        })
        .finally(() => {
          setParametersLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramNames]);

  const handleSearchTreeItemSelect = (_event: React.SyntheticEvent, itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setFilterText(stripTrailingPathDelimiter(itemId, pathDelimiter));
    }
  };

  const handleParamBreadcrumbSelect = (path: string): void => {
    setFilterText(path);
  };

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
