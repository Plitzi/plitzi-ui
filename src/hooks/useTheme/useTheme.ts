// Packages
import { use, useMemo } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';

// Alias
import cva from '@/helpers/cvaWrapper';
import ThemeContext from '@components/ThemeProvider/ThemeContext';
import { emptyObject } from '@/helpers/utils';

// Types
import type { cvaFunction } from '@/helpers/cvaWrapper';

export type themeCvaFunction<T> = (props?: { [key: string]: string }) => cvaFunction<T>;

type ThemeSlot = { [key: string]: object };
type ThemeClassName<T> = { [K in keyof T]?: string } | string;
type VariantKeys = { [key: string]: readonly (string | number)[] };
type ThemeVariantKey<T extends VariantKeys> = { [K in keyof T]?: T[K][number] };

export type useThemeResponse<TSlot extends ThemeSlot, TisString = true> = TisString extends false
  ? { [key in keyof TSlot]: string }
  : string;

export type useThemeProps<TSlot extends ThemeSlot, T extends VariantKeys> = {
  className?: ThemeClassName<TSlot>;
  componentKey: string | [keyof TSlot][number][];
  variant?: ThemeVariantKey<T>;
  defaultStyle?: {
    base?: string | string[];
    variants?: any;
    defaultVariants?: object;
    compoundVariants?: object[];
  };
};

export type useThemeSharedProps<TSlot extends ThemeSlot, TVariantKeys extends VariantKeys> = {
  className?: ThemeClassName<TSlot>;
} & ThemeVariantKey<TVariantKeys>;

const useTheme = <TSlots extends ThemeSlot, TVariantKeys extends VariantKeys, TisString = true>(
  componentName: string,
  { componentKey, className, variant = emptyObject, defaultStyle = emptyObject }: useThemeProps<TSlots, TVariantKeys>
) => {
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
      if (!callback || typeof callback !== 'function') {
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
        if (callback && typeof callback === 'function' && typeof className === 'object') {
          value = callback({ ...variant, className: get(className, compKey, '') });
        } else if (callback && typeof callback === 'function' && typeof className === 'string' && i === 0) {
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
  }, [theme, componentName, componentKey?.length, className, variant, defaultStyleCVA]) as useThemeResponse<
    TSlots,
    TisString
  >;
};

export default useTheme;
