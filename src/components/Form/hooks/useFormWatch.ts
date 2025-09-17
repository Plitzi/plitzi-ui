import get from 'lodash/get.js';
import { useEffect, useMemo, useState } from 'react';

import useDidUpdateEffect from '@hooks/useDidUpdateEffect';

import type { FieldPathValue, FieldPathValues, FieldValues, Path, UseFormReturn } from 'react-hook-form';

type WatchValue<T extends FieldValues, K extends Path<T> | Path<T>[] | undefined> = K extends Path<T>[]
  ? [...FieldPathValues<T, K>]
  : K extends Path<T>
    ? FieldPathValue<T, K>
    : unknown;

function useFormWatch<T extends FieldValues, K extends Path<T>>(form: UseFormReturn<T>, names: K): FieldPathValue<T, K>;

function useFormWatch<T extends FieldValues, K extends Path<T>[]>(
  form: UseFormReturn<T>,
  names?: [...K]
): [...FieldPathValues<T, K>];

function useFormWatch<T extends FieldValues>(form: UseFormReturn<T>, names?: Path<T> | Path<T>[]) {
  const [mounted, setMounted] = useState(false);
  const finalNames = useMemo(
    () => names ?? (Object.keys(form.formState.defaultValues ?? {}) as Path<T>[]),
    [form.formState.defaultValues, names]
  );
  const [value, setValue] = useState<WatchValue<T, typeof finalNames>>(() => {
    const values = form.getValues();
    if (Array.isArray(finalNames)) {
      return finalNames.map(name => get(values, name) as Path<T>) as WatchValue<T, typeof finalNames>;
    }

    return values[finalNames];
  });

  useEffect(() => {
    const subscription = form.watch((_values, { name }) => {
      if (typeof finalNames === 'string') {
        setValue(form.getValues(finalNames));
      } else if (name && finalNames.includes(name)) {
        setValue(form.getValues(finalNames));
      }
    });

    if (!mounted) {
      if (typeof finalNames === 'string') {
        setValue(form.getValues(finalNames));
      } else {
        setValue(form.getValues(finalNames));
      }

      setMounted(true);
    }

    return () => subscription.unsubscribe();
  }, [form, mounted, finalNames]);

  useDidUpdateEffect(() => {
    if (typeof finalNames === 'string') {
      setValue(form.getValues(finalNames));
    } else {
      setValue(form.getValues(finalNames));
    }
  }, [form.formState.defaultValues]);

  return value;
}

export default useFormWatch;
