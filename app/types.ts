export type DescribedParamType = {
  Name: string;
  Type: string;
};

export type ParamTypeType = 'SecureString' | 'String' | 'StringList';

export type ParamType = {
  name: string;
  type: ParamTypeType;
  value: string;
};
