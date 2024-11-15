// Packages
import { use, useMemo } from 'react';
import { cva } from 'class-variance-authority';
import get from 'lodash/get';
import set from 'lodash/set';

// Alias
import ThemeContext from '@components/ThemeProvider/ThemeContext';
import { emptyObject } from '@/helpers/utils';

// Types
import type { cvaFunction } from '@/types/cva';

export type themeCvaFunction<T> = (props?: { [key: string]: string }) => cvaFunction<T>;

export type useThemeResponse<Tslots extends { [key: string]: object }, TisString = true> = TisString extends false
  ? { [key in keyof Tslots]: string }
  : string;

export type useThemeProps<T extends readonly string[]> = {
  className?: string;
  componentKey: string | string[];
  variant?: { [key in T[number]]?: string | number };
  defaultStyle?: {
    base?: string | string[];
    variants?: any;
    defaultVariants?: object;
    compoundVariants?: object[];
  };
};

export type useThemeSharedProps<S extends readonly string[] = []> = { className?: string } & {
  [K in S[number]]?: string | number;
};

const useTheme = <TSlots extends { [key: string]: object }, TVariantKeys extends readonly string[], TisString = true>({
  componentKey = '',
  className,
  variant = emptyObject,
  defaultStyle = emptyObject
}: useThemeProps<TVariantKeys>): useThemeResponse<TSlots, TisString> => {
  const { theme } = use(ThemeContext);
  const { base = '', variants = emptyObject, defaultVariants = emptyObject, compoundVariants } = defaultStyle;
  const defaultStyleCVA = useMemo(
    () => cva(base, { variants, compoundVariants, defaultVariants }),
    [base, variants, defaultVariants, compoundVariants]
  );

  return useMemo(() => {
    if (typeof componentKey === 'string') {
      let callback = defaultStyleCVA;
      callback = get(theme, `components.${componentKey}`, defaultStyleCVA);
      if (!callback || typeof callback !== 'function') {
        return '';
      }

      return callback({ ...variant, className });
    }

    if (Array.isArray(componentKey)) {
      const classNameObj = {};
      componentKey.forEach((compKey, i) => {
        const callback = get(theme, `components.${compKey}`, defaultStyleCVA);
        let value;
        if (callback && typeof callback === 'function' && i === 0) {
          value = callback({ ...variant, className });
        } else if (callback && typeof callback === 'function') {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, componentKey, componentKey.length, className, variant, defaultStyleCVA]) as useThemeResponse<
    TSlots,
    TisString
  >;
};

export default useTheme;
