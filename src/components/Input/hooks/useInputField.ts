import { useId } from 'react';

import type { ErrorMessageProps } from '@components/ErrorMessage';

export type InputFieldError = ErrorMessageProps['message'] | ErrorMessageProps['error'];

export type InputFieldControlProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
};

export type InputField = {
  id: string;
  labelId: string;
  describedBy?: string;
  controlProps: InputFieldControlProps;
};

export const getInputFieldIds = (id: string) => ({ labelId: `${id}-label`, errorId: `${id}-error` });

export const hasErrorMessage = (error?: InputFieldError): error is string => typeof error === 'string' && error !== '';

/**
 * The ids that tie an `InputContainer`'s label and error message to the control it wraps: the caller's `id` when
 * given, else one of React's. `InputContainer` derives the same label and error ids from the `id` it receives.
 */
const useInputField = ({ id, error }: { id?: string; error?: InputFieldError }): InputField => {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const { labelId, errorId } = getInputFieldIds(controlId);
  const describedBy = hasErrorMessage(error) ? errorId : undefined;

  return {
    id: controlId,
    labelId,
    describedBy,
    controlProps: { id: controlId, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined }
  };
};

export default useInputField;
