import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

/**
 * jest-dom's matchers, typed for Vitest 5.
 *
 * `@testing-library/jest-dom/vitest` still augments Vitest's old single-parameter `Assertion<T>`. Vitest 5 builds
 * `Assertion<R, T>` on `Matchers<R, T>` instead, so that augmentation no longer lands and every matcher reads as an
 * unresolved call. The runtime half is `expect.extend(matchers)` in `setupTests.ts`. Delete this file once jest-dom
 * ships Vitest 5 types.
 */
declare module 'vitest' {
  // A declaration merge must repeat Vitest's type parameters by name, and has nothing to add but the base.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> extends TestingLibraryMatchers<
    unknown,
    R
  > {}
}
