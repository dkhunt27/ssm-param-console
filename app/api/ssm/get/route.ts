import { getAllParameters } from '../ssm-utils';

export async function POST(request: Request) {
  const req = await request.json();

  console.log(`API - processing get params for startingPath: ${req.startingPath}`);

  try {
    const data = await getAllParameters({ startingPath: req.startingPath });
    // writeFileSync('./data.json', JSON.stringify(data, null, 2)); // TODO: remove this line
    return Response.json(data);
  } catch (err) {
    console.log('Error trying to getAllParameters', err);
    throw err;
  }
}
