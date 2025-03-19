import { Parameter } from '@aws-sdk/client-ssm';
import { get as _get } from 'lodash';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getResults } from '@/app/data';

type FetchWrapperInputsType = {
  url: string;
  hookKey: string;
  options?: RequestInit;
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

export const useSsmParamReal = (startingPath: string): UseQueryResult<Parameter[], Error> => {
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

export const useSsmParam = (startingPath: string): UseQueryResult<Parameter[], Error> => {
  return { data: getResults, error: null, isLoading: false } as never;
};
