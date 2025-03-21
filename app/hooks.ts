import { get as _get } from 'lodash';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { getResults } from '@/app/data.secrets';
import { ParamType } from './types';

type FetchWrapperInputsType = {
  url: string;
  hookKey: string;
  options?: RequestInit;
};

type SsmParamResultsType = {
  queryResults: UseQueryResult<ParamType[], Error>;
  saveParam: (param: ParamType) => Promise<void>;
  deleteParam: (param: ParamType) => Promise<void>;
};

const QUERY_KEY = 'ParamList';

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

export const useSsmParamReal = (startingPath: string): SsmParamResultsType => {
  const queryClient = useQueryClient();
  const queryKeys: string[] = [QUERY_KEY];

  const queryResults = useQuery<ParamType[], Error, ParamType[]>({
    queryKey: queryKeys,
    queryFn: () => {
      return fetchWrapper<ParamType[]>({
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

  const saveParam = async (param: ParamType): Promise<void> => {
    const url = `/api/ssm/save`;
    const key = 'saveParam';

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(param),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // TODO: refetch all params??? or just update local copy?
      // queryClient.invalidateQueries({ queryKey: queryKeys });
      queryClient.setQueryData<ParamType[]>(queryKeys, (oldData) => {
        if (!oldData) {
          throw new Error(`${key}: data is corrupted`);
        }

        const index = oldData.findIndex((item) => item.name == param.name);
        if (index === -1) {
          return [...oldData, param];
        }
        return [...oldData.slice(0, index), param, ...oldData.slice(index + 1)];
      });
    } else {
      const responseError = {
        statusText: response.statusText,
        status: response.status,
        key,
        code: null,
      };

      const body = await response.json();
      console.error(`${key} failed`, body);
      responseError.code = _get(body, 'code', null);

      throw responseError;
    }
  };

  const deleteParam = async (param: ParamType): Promise<void> => {
    const url = `/api/ssm/delete`;
    const key = 'deleteParam';

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(param),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // TODO: refetch all params??? or just update local copy?
      // queryClient.invalidateQueries({ queryKey: queryKeys });
      queryClient.setQueryData<ParamType[]>(queryKeys, (oldData) => {
        if (!oldData) {
          throw new Error(`${key}: data is corrupted`);
        }

        return oldData.filter((item) => item.name !== param.name);
      });
    } else {
      const responseError = {
        statusText: response.statusText,
        status: response.status,
        key,
        code: null,
      };

      const body = await response.json();
      console.error(`${key} failed`, body);
      responseError.code = _get(body, 'code', null);

      throw responseError;
    }
  };

  return { queryResults, saveParam, deleteParam };
};

export const useSsmParamMock = (startingPath: string): UseQueryResult<ParamType[], Error> => {
  return { data: getResults, error: null, isLoading: false } as never;
};
