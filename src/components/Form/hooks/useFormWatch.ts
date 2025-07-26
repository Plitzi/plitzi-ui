import get from 'lodash/get';
import { useEffect, useState } from 'react';

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
  names: [...K]
): [...FieldPathValues<T, K>];

function useFormWatch<T extends FieldValues>(form: UseFormReturn<T>, names: Path<T> | Path<T>[]) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState<WatchValue<T, typeof names>>(() => {
    const values = form.getValues();
    if (Array.isArray(names)) {
      return names.map(name => get(values, name) as Path<T>) as WatchValue<T, typeof names>;
    }

    return values[names];
  });

  useEffect(() => {
    const subscription = form.watch((_values, { name }) => {
      if (typeof names === 'string') {
        setValue(form.getValues(names));
      } else if (name && names.includes(name)) {
        setValue(form.getValues(names));
      }
    });

    if (!mounted) {
      if (typeof names === 'string') {
        setValue(form.getValues(names));
      } else {
        setValue(form.getValues(names));
      }

      setMounted(true);
    }

    return () => subscription.unsubscribe();
  }, [form, mounted, names]);

  useDidUpdateEffect(() => {
    if (typeof names === 'string') {
      setValue(form.getValues(names));
    } else {
      setValue(form.getValues(names));
    }
  }, [form.formState.defaultValues]);

  return value;
}

export default useFormWatch;
