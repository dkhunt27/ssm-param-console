import { Parameter, ParameterMetadata } from '@aws-sdk/client-ssm';
import { describeResults, getResults } from '@/app/data';

export const useSsmParam = () => {
  const describeParameters = async (): Promise<ParameterMetadata[]> => {
    // const input: DescribeParametersCommandInput = {
    //   ParameterFilters: [
    //     { Key: "Path", Option: "Recursive", Values: ["/artemis"] },
    //   ],
    // }
    console.log('describeParameters fetching');
    try {
      // const params = await await ssm.send(new DescribeParametersCommand(input))
      // return params.Parameters
      return describeResults.Parameters ?? [];
    } catch (err) {
      console.error('Error trying to describeParameters', err);
      throw err;
    }
  };

  const getParameters = async (names: string[]): Promise<Parameter[]> => {
    // const input: GetParametersCommandInput = {
    //   Names: names,
    //   WithDecryption: true,
    // }

    // const params = await ssm.send(new GetParametersCommand(input))
    // return describeResults.Parameters
    // }
    console.log('getParameters fetching');
    return getResults.Parameters ?? [];
  };

  return { describeParameters, getParameters };
};
