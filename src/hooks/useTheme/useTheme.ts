import get from 'lodash/get';
import set from 'lodash/set';
import { use, useMemo } from 'react';

import cva from '@/helpers/cvaWrapper';
import { emptyObject } from '@/helpers/utils';
import { ThemeContext } from '@components/Provider/providers/ThemeProvider';

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
  defaultStyle?: {
    base?: string | string[];
    variants?: Record<string, unknown>;
    defaultVariants?: object;
    compoundVariants?: object[];
  };
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
  { componentKey, className, variant = emptyObject, defaultStyle = emptyObject }: useThemeProps<T, K>
) {
  const { theme } = use(ThemeContext);
  const { base = '', variants = emptyObject, defaultVariants = emptyObject, compoundVariants } = defaultStyle;
  const defaultStyleCVA = useMemo(
    () => cva(base, { variants, compoundVariants, defaultVariants }),
    [base, variants, defaultVariants, compoundVariants]
  );

  return useMemo(() => {
    if (typeof componentKey === 'string') {
      let callback = defaultStyleCVA;
      callback = get(theme, `components.${componentName}.${componentKey}`, defaultStyleCVA);
      if (typeof callback !== 'function') {
        return className ?? '';
      }

      return callback({ ...variant, className });
    }

    if (Array.isArray(componentKey)) {
      const classNameObj = {};
      componentKey.forEach((compKey, i) => {
        compKey = compKey as string;
        const callback = get(theme, `components.${componentName}.${String(compKey)}`, defaultStyleCVA);
        let value;
        if (typeof callback === 'function' && typeof className === 'object') {
          value = callback({ ...variant, className: get(className, compKey, '') });
        } else if (typeof callback === 'function' && typeof className === 'string' && i === 0) {
          value = callback({ ...variant, className });
        } else if (typeof callback === 'function') {
          value = callback(variant);
        }

        if (compKey.split('.').length > 1) {
          set(classNameObj, compKey.split('.').slice(1).join('.'), value);
        } else {
          set(classNameObj, compKey, value);
        }
      });

      return classNameObj;
    }

    return '';
  }, [theme, componentName, componentKey, className, variant, defaultStyleCVA]);
}

export default useTheme;
