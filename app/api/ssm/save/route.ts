import { saveParameter } from '../ssm-utils';

export async function POST(request: Request) {
  const req = await request.json();

  console.log(`API - processing save params for: ${req.name}`);

  const data = saveParameter(req);

  return Response.json(data);
}
