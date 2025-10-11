/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Switch from '@components/Switch';

import type { BaseFormFieldType } from '../Form';
import type { SwitchProps } from '@components/Switch';
import type { ChangeEvent, RefObject } from 'react';
import type { FieldValues, ControllerProps, FieldPath } from 'react-hook-form';

export type FormSwitchProps<T extends FieldValues, TName extends FieldPath<T>> = SwitchProps &
  BaseFormFieldType<T, TName>;

const FormSwitch = <T extends FieldValues, TName extends FieldPath<T>>(props: FormSwitchProps<T, TName>) => {
  const { control } = useFormContext<T>();
  const { onChange: onChangeProp } = props;

  const handleChange = useCallback(
    (onChange: (...event: any[]) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
      onChangeProp?.(e);
    },
    [onChangeProp]
  );

  const renderMemo = useMemo<ControllerProps<T>['render']>(
    () =>
      function Render({ field: { ref, value, onChange, name }, fieldState: { error: fieldError } }) {
        const onChangeMemo = useMemo(() => handleChange(onChange), [onChange]);

        return (
          <Switch
            {...props}
            ref={ref as unknown as RefObject<HTMLInputElement>}
            value={value}
            name={name}
            error={fieldError?.message}
            onChange={onChangeMemo}
          />
        );
      },
    [props, handleChange]
  );

  return <Controller control={props.control ?? control} name={props.name} render={renderMemo} />;
};

export default FormSwitch;
