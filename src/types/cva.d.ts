// Types
import type { ClassProp, ClassValue, StringToBoolean } from 'class-variance-authority/types';

export type ConfigSchema = Record<string, Record<string, ClassValue>>;

export type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof t[Variant]> | null | undefined;
};

export type Props<T> = T extends ConfigSchema ? ConfigVariants<T> & ClassProp : ClassProp;

export type cvaFunction<T> = (props?: Props<T> | undefined) => string;
