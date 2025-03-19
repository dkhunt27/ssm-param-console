import {
  DescribeParametersCommandInput,
  ParameterMetadata,
  DescribeParametersCommand,
  DescribeParametersCommandOutput,
  SSMClient,
  SSMClientConfig,
  Parameter,
  GetParametersByPathCommandInput,
  GetParametersByPathCommand,
  GetParametersByPathCommandOutput,
} from '@aws-sdk/client-ssm';

const config: SSMClientConfig = { region: 'us-west-2' };
const ssm = new SSMClient(config);

export const describeAllParameters = async (params: { input: DescribeParametersCommandInput }): Promise<ParameterMetadata[]> => {
  const items: ParameterMetadata[] = [];
  const { input } = params;
  const command = new DescribeParametersCommand(input);
  let data: DescribeParametersCommandOutput = await ssm.send(command);
  do {
    if (data.Parameters) {
      items.push(...data.Parameters);
    }
    if (data && data.NextToken) {
      input.NextToken = data.NextToken;
      const command = new DescribeParametersCommand(input);
      data = await ssm.send(command);
      if (!data.NextToken) {
        // if there is no NextToken, then add the last set of items to the array
        if (data.Parameters) {
          items.push(...data.Parameters);
        }
      }
    }
  } while (data.NextToken);

  return items;
};

export const getAllParameters = async (params: { input: GetParametersByPathCommandInput }): Promise<Parameter[]> => {
  const items: Parameter[] = [];
  const { input } = params;
  const command = new GetParametersByPathCommand(input);
  let data: GetParametersByPathCommandOutput = await ssm.send(command);
  do {
    if (data.Parameters) {
      console.log(`Pushing parameters: ${data.Parameters.length}`);
      items.push(...data.Parameters);
    }
    if (data && data.NextToken) {
      input.NextToken = data.NextToken;
      const command = new GetParametersByPathCommand(input);
      data = await ssm.send(command);
      if (!data.NextToken) {
        // if there is no NextToken, then add the last set of items to the array
        if (data.Parameters) {
          items.push(...data.Parameters);
        }
      }
    }
  } while (data.NextToken);

  return items;
};
