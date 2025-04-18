import * as cvaModule from 'class-variance-authority';

import type { ClassProp, ClassValue, StringToBoolean } from 'class-variance-authority/types';

export type ConfigSchema = Record<string, Record<string, ClassValue>>;

export type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};

export type Props<T> = T extends ConfigSchema ? ConfigVariants<T> & ClassProp : ClassProp;

const { cva } = cvaModule;

export default cva;
