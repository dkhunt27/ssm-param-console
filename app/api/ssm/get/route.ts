import { GetParametersByPathCommandInput, Parameter } from '@aws-sdk/client-ssm';
import { getAllParameters } from '../ssm-utils';

export async function POST(request: Request) {
  const req = await request.json();

  console.log(`API - processing get params for startingPath: ${req.startingPath}`);

  const input: GetParametersByPathCommandInput = {
    Path: req.startingPath,
    Recursive: true,
    WithDecryption: true,
  };

  let data: Parameter[] = [];
  try {
    data = await getAllParameters({ input });
  } catch (err) {
    console.log('Error trying to getAllParameters', err);
    throw err;
  }

  // const mapped: DescribedParamType[] = data.map((param) => {
  //   if (!param.Name) {
  //     throw new Error(`Name not found: ${JSON.stringify(param)}`);
  //   }
  //   if (!param.Type) {
  //     throw new Error(`Type not found: ${JSON.stringify(param)}`);
  //   }
  //   return {
  //     Name: param.Name,
  //     Type: param.Type,
  //   };
  // });

  return Response.json(data);
}
