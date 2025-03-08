import { useEffect, useState } from 'react';

import type { FieldPathValue, FieldPathValues, FieldValues, Path, UseFormReturn } from 'react-hook-form';

type WatchValue<
  T extends FieldValues,
  K extends Path<T> | readonly Path<T>[] | undefined
> = K extends readonly Path<T>[] ? [...FieldPathValues<T, K>] : K extends Path<T> ? FieldPathValue<T, K> : unknown;

function useFormWatch<T extends FieldValues, K extends Path<T>>(
  form: UseFormReturn<T>,
  names: K
): FieldPathValue<T, K> | undefined;

function useFormWatch<T extends FieldValues, K extends readonly Path<T>[]>(
  form: UseFormReturn<T>,
  names: readonly [...K]
): [...FieldPathValues<T, K>] | undefined;

function useFormWatch<T extends FieldValues>(form: UseFormReturn<T>, names: Path<T> | readonly Path<T>[]) {
  const [value, setValue] = useState<WatchValue<T, typeof names> | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    if (typeof names === 'string') {
      setValue(form.getValues(names));
    } else {
      setValue(form.getValues(names));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState.defaultValues]);

  return value;
}

export default useFormWatch;
