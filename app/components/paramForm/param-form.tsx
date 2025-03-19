import { Parameter, ParameterType } from '@aws-sdk/client-ssm';
import { Typography, Modal, Box, Stack, Button } from '@mui/material';
import { Dispatch, ReactElement, SetStateAction, useEffect } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { FormControlInput } from '../forms/form-control-input';
import { isEmpty as _isEmpty } from 'lodash';

type PropsType = {
  param: Parameter | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type ParamFormType = { Name: string; Description: string; Type: ParameterType; Value: string };

export const ParamForm = (props: PropsType): ReactElement => {
  const { param, setOpen } = props;

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
  } = useForm<ParamFormType>({
    mode: 'onChange',
    // resolver: zodResolver(LoginFormSchema),
    // shouldUseNativeValidation: true
  });

  useEffect(() => {
    // setValue('ARN', param?.ARN || '');
    // setValue('DataType', param?.DataType || '');
    // setValue('DataType', param?.Description || '');
    // setValue('LastModifiedDate', param?.LastModifiedDate || '');
    setValue('Name', param?.Name || '');
    // setValue('Selector', param?.Selector || '');
    // setValue('SourceResult', param?.SourceResult || '');
    setValue('Type', param?.Type || ParameterType.STRING);
    setValue('Value', param?.Value || '');
    // setValue('Version', param?.Version || '');
  }, [setValue, param]);

  const handleSave = async (formData: ParamFormType): Promise<void> => {
    console.log('handleSave', formData);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const ctrl = control as unknown as Control<FieldValues, any>;

  // const rootErrMsg = _get(errors, 'root.message', null);

  return (
    <>
      <Stack spacing={4}>
        <FormControlInput id="Name" label="Name" fieldName="Name" control={ctrl} errors={errors} autoCapitalize="none" />
        <FormControlInput id="Type" label="Type" fieldName="Type" control={ctrl} errors={errors} autoCapitalize="none" />
        <FormControlInput id="Value" label="Value" fieldName="Value" control={ctrl} errors={errors} autoCapitalize="none" />
        {/* {rootErrMsg && <Alert severity='error'>{rootErrMsg}</Alert>}
        {debugMode && <Typography>{JSON.stringify(errors)}</Typography>} */}
      </Stack>
      <Stack spacing={2}>
        <Button
          // fullWidth={saveButtonFullWidth}
          size="large"
          variant="contained"
          sx={{ my: 4 }}
          disabled={_isEmpty(errors) ? false : true}
          onClick={handleSubmit(handleSave)}
        >
          Save
        </Button>
        <Button
          // fullWidth={saveButtonFullWidth}
          size="large"
          variant="contained"
          sx={{ my: 4 }}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Stack>
    </>
  );
};
