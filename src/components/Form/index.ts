import { useFormContext, useFieldArray } from 'react-hook-form';

import * as fields from './fields';
import Form from './Form';
import { useForm, useFormWatch } from './hooks';

export * from './Form';
export * from './fields';
export * from './hooks';

export default Form;

export { fields, useForm, useFormWatch, useFormContext, useFieldArray };
