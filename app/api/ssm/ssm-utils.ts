import { ParamType } from '@/app/types';
import {
  SSMClient,
  SSMClientConfig,
  Parameter,
  GetParametersByPathCommandInput,
  GetParametersByPathCommand,
  GetParametersByPathCommandOutput,
  PutParameterCommandInput,
  PutParameterCommand,
  DeleteParameterCommandInput,
  DeleteParameterCommand,
} from '@aws-sdk/client-ssm';

const config: SSMClientConfig = { region: 'us-west-2' };
const ssm = new SSMClient(config);

export const getAllParameters = async (params: { startingPath: string }): Promise<ParamType[]> => {
  const { startingPath } = params;

  const input: GetParametersByPathCommandInput = {
    Path: startingPath,
    Recursive: true,
    WithDecryption: true,
  };

  const command = new GetParametersByPathCommand(input);
  let data: GetParametersByPathCommandOutput = await ssm.send(command);

  const items: Parameter[] = [];

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

  const mapped: ParamType[] = items.map((param) => mapToParamType(param));

  return mapped;
};

export const saveParameter = async (param: ParamType): Promise<void> => {
  const input: PutParameterCommandInput = {
    Name: param.name,
    Type: param.type,
    Value: param.value,
    Overwrite: true,
  };

  try {
    const command = new PutParameterCommand(input);

    await ssm.send(command);

    return;
  } catch (err) {
    console.error('Error trying to saveParameter', err);
    throw err;
  }
};

const mapToParamType = (param: Parameter): ParamType => {
  // if (!param.ARN) {
  //   throw new Error(`ARN not found: ${JSON.stringify(param)}`);
  // }
  if (!param.Name) {
    throw new Error(`Name not found: ${JSON.stringify(param)}`);
  }
  if (!param.Type) {
    throw new Error(`Type not found: ${JSON.stringify(param)}`);
  }
  if (!param.Value) {
    throw new Error(`Value not found: ${JSON.stringify(param)}`);
  }

  return {
    // arn: param.ARN,
    name: param.Name,
    type: param.Type,
    value: param.Value,
  };
};

export const deleteParameter = async (param: ParamType): Promise<void> => {
  const input: DeleteParameterCommandInput = {
    Name: param.name,
  };

  try {
    const command = new DeleteParameterCommand(input);

    await ssm.send(command);

    return;
  } catch (err) {
    console.error('Error trying to deleteParameter', err);
    throw err;
  }
};
