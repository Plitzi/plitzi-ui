import { useEffect, useState } from 'react';

import type { RefObject } from 'react';
import type { FieldPathValue, FieldPathValues, FieldValues, Path, UseFormReturn } from 'react-hook-form';

type WatchValue<
  T extends FieldValues,
  K extends Path<T> | readonly Path<T>[] | undefined
> = K extends readonly Path<T>[] ? [...FieldPathValues<T, K>] : K extends Path<T> ? FieldPathValue<T, K> : unknown;

type FormRef<T extends FieldValues> = RefObject<UseFormReturn<T> | null> | null | undefined;

function useFormWatch<T extends FieldValues, K extends Path<T>>(
  formRef: FormRef<T>,
  names: K
): FieldPathValue<T, K> | undefined;

function useFormWatch<T extends FieldValues, K extends readonly Path<T>[]>(
  formRef: FormRef<T>,
  names: readonly [...K]
): [...FieldPathValues<T, K>] | undefined;

function useFormWatch<T extends FieldValues>(formRef: FormRef<T>, names: Path<T> | readonly Path<T>[]) {
  const [value, setValue] = useState<WatchValue<T, typeof names> | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!formRef?.current) {
      return;
    }

    const subscription = formRef.current.watch((_values, { name }) => {
      if (typeof names === 'string') {
        setValue(formRef.current?.getValues(names));
      } else if (name && names.includes(name)) {
        setValue(formRef.current?.getValues(names));
      }
    });

    if (!mounted) {
      if (typeof names === 'string') {
        setValue(formRef.current.getValues(names));
      } else {
        setValue(formRef.current.getValues(names));
      }

      setMounted(true);
    }

    return () => subscription.unsubscribe();
  }, [formRef, mounted, names]);

  return value;
}

export default useFormWatch;
