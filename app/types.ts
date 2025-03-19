export type DescribedParamType = {
  Name: string;
  Type: string;
};

export type ParamType = { id: string; name: string; description?: string; type: 'SecureString' | 'String' | 'StringList'; value: string };
