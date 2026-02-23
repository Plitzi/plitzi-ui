import { use, useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { get, set } from '@/helpers/lodash';
import { ThemeContext } from '@components/Provider/providers/ThemeProvider';
import useValueMemo from '@hooks/useValueMemo';

type ThemeSlot = Record<string, object>;
type ThemeClassName<T> = { [K in keyof T]?: string } | string;
type VariantKeys = { [key: string]: readonly (string | number | boolean)[] };
type ThemeVariantKey<T extends VariantKeys> = { [K in keyof T]?: T[K][number] };

export type useThemeSharedProps<T extends ThemeSlot, K extends VariantKeys> = {
  className?: ThemeClassName<{ [K in keyof T]?: string }>;
} & ThemeVariantKey<K>;

type BaseUseThemeProps<T extends ThemeSlot, K extends VariantKeys> = {
  className?: ThemeClassName<T>;
  variants?: ThemeVariantKey<K>;
};

function useTheme<T extends ThemeSlot, K extends VariantKeys>(
  componentName: string | string[],
  props: {
    componentKey: keyof T;
  } & BaseUseThemeProps<T, K>
): string;

function useTheme<T extends ThemeSlot, K extends VariantKeys>(
  componentName: string | string[],
  props: {
    componentKey?: (keyof T)[];
  } & BaseUseThemeProps<T, K>
): { [K in [keyof T][number]]: string };

function useTheme<T extends ThemeSlot, K extends VariantKeys>(
  componentName: string | string[],
  { componentKey, className, variants }: { componentKey?: keyof T | readonly (keyof T)[] } & BaseUseThemeProps<T, K>
) {
  const { theme } = use(ThemeContext);
  componentName = useValueMemo(componentName);
  className = useValueMemo(className);

  const getClasses = useCallback(
    (key: string, variants: ThemeVariantKey<K> = {}, className: string = '') => {
      variants = { ...variants, className };
      if (typeof componentName === 'string') {
        return get(theme.components[componentName], key, undefined)?.(variants) ?? className;
      }

      const classes = componentName
        .map(compName => get(theme.components[compName], key, undefined)?.(variants))
        .filter(Boolean)
        .join(' ');

      return classes ? classes : className;
    },
    [theme.components, componentName]
  );

  componentKey = useMemo(() => {
    if (typeof componentKey !== 'undefined') {
      return componentKey;
    }

    if (componentName && typeof componentName === 'string') {
      return Object.keys(theme.components[componentName]);
    }

    if (Array.isArray(componentName) && componentName.length > 0) {
      return componentName.map(name => Object.keys(theme.components[name])).flat();
    }

    return undefined;
  }, [componentKey, componentName, theme.components]);

  return useMemo(() => {
    if (componentKey && typeof componentKey === 'string') {
      if (className && typeof className === 'object') {
        return twMerge(getClasses(componentKey, variants, get(className, componentKey, '') as string));
      }

      return twMerge(getClasses(componentKey, variants, className));
    }

    if (componentKey && Array.isArray(componentKey)) {
      const classNameObj = {};
      (componentKey as string[]).forEach((key, i) => {
        let classNameValue;
        if (typeof className === 'object') {
          classNameValue = get(className, key) as string | undefined;
        } else if (typeof className === 'string' && i === 0) {
          classNameValue = className;
        }

        const value = twMerge(getClasses(key, variants, classNameValue));
        if (key.split('.').length > 1) {
          set(classNameObj, key.split('.').slice(1).join('.'), value);
        } else {
          set(classNameObj, key, value);
        }
      });

      return classNameObj;
    }

    return '';
  }, [componentKey, className, getClasses, variants]);
}

export default useTheme;
