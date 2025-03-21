import { Stack, Button } from '@mui/material';
import { ReactElement, useEffect } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { FormControlInput } from '../forms/form-control-input';
import { isEmpty as _isEmpty } from 'lodash';
import { ParamType } from '@/app/types';
import { valueIsJson } from '@/app/utils/json';
import { FormControlJsonInput } from '../forms/form-control-json-input';
import { FormControlInputRadioGroup } from '../forms/form-control-input-radio-group';

type PropsType = {
  param: ParamType | undefined;
  isEdit: boolean;
  handleSave: (param: ParamType) => Promise<void>;
  handleClose: () => void;
};

type ParamFormType = ParamType;

export const ParamForm = (props: PropsType): ReactElement => {
  const { param, isEdit, handleSave, handleClose } = props;

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
    // setValue('arn', param?.arn || '');
    // setValue('DataType', param?.DataType || '');
    // setValue('DataType', param?.Description || '');
    // setValue('LastModifiedDate', param?.LastModifiedDate || '');
    setValue('name', param?.name || '');
    // setValue('Selector', param?.Selector || '');
    // setValue('SourceResult', param?.SourceResult || '');
    setValue('type', param?.type || 'String');
    setValue('value', param?.value || '');
    // setValue('Version', param?.Version || '');
  }, [setValue, param]);

  const ctrl = control as unknown as Control<FieldValues, any>;

  // const rootErrMsg = _get(errors, 'root.message', null);
  let useJsonInput = valueIsJson(param?.value);

  return (
    <>
      <Stack spacing={4}>
        <FormControlInput id="Name" label="Name" fieldName="name" control={ctrl} errors={errors} autoCapitalize="none" disabled={isEdit} />
        <FormControlInput id="Type" label="Type" fieldName="type" control={ctrl} errors={errors} autoCapitalize="none" disabled={isEdit} />
        {/* <FormControlInputRadioGroup
          id="Type"
          label="Type"
          fieldName="type"
          defaultValue={param?.type}
          options={[
            { label: 'String', value: 'String' },
            { label: 'SecureString', value: 'SecureString' },
            { label: 'StringList', value: 'StringList' },
          ]}
          control={ctrl}
        /> */}
        {/* {useJsonInput && <FormControlJsonInput id="Value" label="Value" fieldName="value" control={ctrl} />} */}
        {useJsonInput && <FormControlInput id="Value" label="Value" fieldName="value" control={ctrl} errors={errors} autoCapitalize="none" multiline={true} />}
        {!useJsonInput && <FormControlInput id="Value" label="Value" fieldName="value" control={ctrl} errors={errors} autoCapitalize="none" />}
        {/* {rootErrMsg && <Alert severity='error'>{rootErrMsg}</Alert>}
        {debugMode && <Typography>{JSON.stringify(errors)}</Typography>} */}
      </Stack>
      <Stack spacing={2} direction={'row'} justifyContent={'flex-end'}>
        <Button
          // fullWidth={saveButtonFullWidth}
          size="large"
          variant="text"
          color="error"
          sx={{ my: 4 }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          // fullWidth={saveButtonFullWidth}
          size="large"
          variant="contained"
          color="primary"
          sx={{ my: 4 }}
          disabled={_isEmpty(errors) ? false : true}
          onClick={handleSubmit(handleSave)}
        >
          Save
        </Button>
      </Stack>
    </>
  );
};
