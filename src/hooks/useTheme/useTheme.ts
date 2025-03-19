import get from 'lodash/get';
import isString from 'lodash/isString';
import set from 'lodash/set';
import { use, useMemo } from 'react';
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
  variant?: ThemeVariantKey<K>;
};

export type useThemeProps<T extends ThemeSlot, K extends VariantKeys> = {
  componentKey: [keyof T][number] | [keyof T][number][];
} & BaseUseThemeProps<T, K>;

function useTheme<T extends ThemeSlot, K extends VariantKeys>(
  componentName: string,
  props: {
    componentKey: [keyof T][number];
  } & BaseUseThemeProps<T, K>
): string;

function useTheme<T extends ThemeSlot, K extends VariantKeys>(
  componentName: string,
  props: {
    componentKey: [keyof T][number][];
  } & BaseUseThemeProps<T, K>
): { [key in keyof T]: string };

function useTheme<T extends ThemeSlot, K extends VariantKeys>(
  componentName: string,
  { componentKey, className, variant }: useThemeProps<T, K>
) {
  const { theme } = use(ThemeContext);
  className = useValueMemo(className);

  return useMemo(() => {
    if (typeof componentKey === 'string') {
      const componentCva = get(theme.components[componentName], componentKey);
      if (typeof componentCva !== 'function') {
        return className ?? '';
      }

      return twMerge(componentCva({ ...variant, className }));
    }

    if (Array.isArray(componentKey)) {
      const classNameObj = {};
      componentKey.filter(isString).forEach((key, i) => {
        const componentCva = get(theme.components[componentName], key);
        if (typeof componentCva !== 'function') {
          return;
        }

        let classNameValue;
        if (typeof className === 'object') {
          classNameValue = get(className, key);
        } else if (typeof className === 'string' && i === 0) {
          classNameValue = className;
        }

        const value = twMerge(componentCva({ ...variant, className: classNameValue }));
        if (key.split('.').length > 1) {
          set(classNameObj, key.split('.').slice(1).join('.'), value);
        } else {
          set(classNameObj, key, value);
        }
      });

      return classNameObj;
    }

    return '';
  }, [componentKey, theme.components, componentName, variant, className]);
}

export default useTheme;
