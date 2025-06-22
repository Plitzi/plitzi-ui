import get from 'lodash/get';
import isString from 'lodash/isString';
import set from 'lodash/set';
import { use, useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { ThemeContext } from '@components/Provider/providers/ThemeProvider';
import useValueMemo from '@hooks/useValueMemo';

type ThemeSlot = { [key: string]: object };
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

export type useThemeProps<T extends ThemeSlot, K extends VariantKeys> = {
  componentKey: [keyof T][number] | [keyof T][number][];
} & BaseUseThemeProps<T, K>;

function useTheme<T extends ThemeSlot, K extends VariantKeys>(
  componentName: string | string[],
  props: {
    componentKey: [keyof T][number];
  } & BaseUseThemeProps<T, K>
): string;

function useTheme<T extends ThemeSlot, K extends VariantKeys>(
  componentName: string | string[],
  props: {
    componentKey: [keyof T][number][];
  } & BaseUseThemeProps<T, K>
): { [key in keyof T]: string };

function useTheme<T extends ThemeSlot, K extends VariantKeys>(
  componentName: string | string[],
  { componentKey, className, variants }: useThemeProps<T, K>
) {
  const { theme } = use(ThemeContext);
  componentName = useValueMemo(componentName);
  className = useValueMemo(className);

  const getClasses = useCallback(
    (componentKey: string, variants: ThemeVariantKey<K> = {}, className: string = '') => {
      variants = { ...variants, className };
      if (typeof componentName === 'string') {
        return get(theme.components[componentName], componentKey, undefined)?.(variants) ?? className;
      }

      const classes = componentName
        .map(compName => get(theme.components[compName], componentKey, undefined)?.(variants))
        .filter(Boolean)
        .join(' ');

      return classes ? classes : className;
    },
    [theme.components, componentName]
  );

  return useMemo(() => {
    if (typeof componentKey === 'string') {
      if (className && typeof className === 'object') {
        return twMerge(getClasses(componentKey, variants, get(className, componentKey, '')));
      }

      return twMerge(getClasses(componentKey, variants, className));
    }

    if (Array.isArray(componentKey)) {
      const classNameObj = {};
      componentKey.filter(isString).forEach((key, i) => {
        let classNameValue;
        if (typeof className === 'object') {
          classNameValue = get(className, key);
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
