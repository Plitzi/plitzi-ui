// Types
import type { ComponentType } from 'react';

export type ComponentProps = { [key: string]: unknown };

type Module = { default: ComponentType<ComponentProps> };

export type LoadComponentResponse = Promise<Module>;

export const loadComponent = async (icon: string, extensions = ['', '.tsx', '.es', '.js', '.cjs', '.mjs']) => {
  for (const ext of extensions) {
    try {
      const filePath = `${icon}${ext}`;
      const component = (await import(/* @vite-ignore */ filePath)) as Module;

      return component;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.error(`Error al cargar ${icon}${ext}`, error);
    }
  }

  throw new Error(`Icon not found: ${icon}`);
};
