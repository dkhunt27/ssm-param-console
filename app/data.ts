import { ParamType } from './types';

export const paramsMock: ParamType[] = [
  {
    // arn: 'arn:aws:ssm:us-west-2:123456789012:parameter/projA/subProjB/qa/apiUrl',
    // DataType: 'text',
    // LastModifiedDate: new Date('2024-12-20T20:42:48.367Z'),
    name: '/projA/subProjB/qa/apiUrl',
    type: 'SecureString',
    value: 'https://some-api.com/api',
    // Version: 2,
  },
  {
    // arn: 'arn:aws:ssm:us-west-2:123456789012:parameter/projA/automation/sandbox/auth0ClientId',
    // DataType: 'text',
    // LastModifiedDate: new Date('2024-07-17T19:15:45.626Z'),
    name: '/projA/automation/sandbox/auth0ClientId',
    type: 'String',
    value: 'sdasidyuasoijdasliasdas',
    // Version: 1,
  },
  {
    // arn: 'arn:aws:ssm:us-west-2:123456789012:parameter/projA/automation/sandbox/auth0ClientSecret',
    // DataType: 'text',
    // LastModifiedDate: new Date('2024-07-17T19:15:45.858Z'),
    name: '/projA/automation/sandbox/auth0ClientSecret',
    type: 'SecureString',
    value: 'moidasd092ujei21321lmdsadqwewq',
    // Version: 1,
  },
  {
    // arn: 'arn:aws:ssm:us-west-2:123456789012:parameter/projA/automation/nonProd/config',
    // DataType: 'text',
    // LastModifiedDate: new Date('2024-07-17T19:15:46.281Z'),
    name: '/projA/automation/nonProd/config',
    type: 'SecureString',
    value: JSON.stringify({ key: 'value' }),
    // Version: 1,
  },
];
