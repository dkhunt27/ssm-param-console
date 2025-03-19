import {
  DescribeParametersCommand,
  DescribeParametersCommandInput,
  GetParametersCommand,
  GetParametersCommandInput,
  Parameter,
  ParameterMetadata,
  SSMClient,
} from '@aws-sdk/client-ssm';
import { describeResults, getResults } from '@/app/data';
import { useAtomValue } from 'jotai';
import { startingPathAtom } from './store';
import { useNotifications } from '@toolpad/core/useNotifications';
import { get as _get } from 'lodash';
import { DescribedParamType } from './types';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

type FetchWrapperInputsType = {
  url: string;
  hookKey: string;
  options?: RequestInit;
};

type SsmParamResultType = {
  status: 'idle' | 'error' | 'loading' | 'success';
  data?: Parameter[] | undefined;
  error?: Error | undefined | null;
};

const fetchWrapper = async <TResponse>({ url, hookKey, options }: FetchWrapperInputsType): Promise<TResponse> => {
  const response = await fetch(url, options);

  if (response.ok) {
    const data = await response.json();
    console.log(`${hookKey} data`, data);
    return data;
  } else {
    const responseError = {
      statusText: response.statusText,
      status: response.status,
      key: hookKey,
      code: null,
    };

    // set error code if it exists
    try {
      const body = await response.json();
      responseError.code = _get(body, 'code', null);
    } catch (err) {
      // do nothing, just don't set code
    }

    throw responseError;
  }
};

export const useSsmParam = (startingPath: string): UseQueryResult<Parameter[], Error> => {
  const queryResults = useQuery<Parameter[], Error, Parameter[]>({
    queryKey: [startingPath],
    queryFn: () => {
      return fetchWrapper<Parameter[]>({
        url: `/api/ssm/get`,
        hookKey: 'useSsmParam',
        options: {
          method: 'POST',
          body: JSON.stringify({ startingPath }),
        },
      });
    },
    // gcTime: the duration React Query stores inactive data before it is garbage collected
    gcTime: 12 * 60 * 60 * 1000, // 12 hours in milliseconds

    // staleTime: the duration data is considered fresh - once it's stale any new calls to the query will
    // trigger a re-fetch from the server
    staleTime: 12 * 60 * 60 * 1000, // 12 hours in milliseconds

    // don't automatically refetch on window focus due to the token expiration issue stated above
    refetchOnWindowFocus: false,

    // retry 3 times unless the error is a 401/403
    retry: (failureCount, error) => {
      const errorStatus = _get(error, 'status', null);
      if (errorStatus === 401 || errorStatus === 403) {
        // if the error is a 401/403, then the user is not authorized; so don't retry
        return false;
      }

      if (failureCount >= 2) {
        // failure count >= 2 means the call was tried 3 times and failed, so don't retry
        return false;
      }

      return true;
    },

    // TODO: improve this logic to not use the notSet default value
    // only enable when there is a startingPath;
    enabled: startingPath !== 'notSet',
  });

  return queryResults;
};

export const useSsmParamOld = () => {
  const startingPath = useAtomValue(startingPathAtom);

  const describeParameters = async (): Promise<DescribedParamType[]> => {
    const data = await fetchWrapper<DescribedParamType[]>({
      url: '/api/ssm/describe',
      hookKey: 'describeParameters',
      options: {
        method: 'POST',
        body: JSON.stringify({ startingPath }),
      },
    });

    return data;
  };

  const getParameters = async (names: string[]): Promise<DescribedParamType[]> => {
    const data = await fetchWrapper<DescribedParamType[]>({
      url: '/api/ssm/get',
      hookKey: 'getParameters',
      options: {
        method: 'POST',
        body: JSON.stringify({ paramNames: names }),
      },
    });

    return data;
  };

  return { describeParameters, getParameters };
};

export const useSsmParamMock = () => {
  const describeParameters = async (): Promise<ParameterMetadata[]> => {
    console.log('describeParameters fetching');
    try {
      return describeResults.Parameters ?? [];
    } catch (err) {
      console.error('Error trying to describeParameters', err);
      throw err;
    }
  };

  const getParameters = async (names: string[]): Promise<Parameter[]> => {
    console.log('getParameters fetching');
    return getResults.Parameters ?? [];
  };

  return { describeParameters, getParameters };
};
