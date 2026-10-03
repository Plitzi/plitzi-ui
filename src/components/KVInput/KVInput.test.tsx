import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { inputTheme } from '@components/Input';
import Provider from '@components/Provider';

import { kvInputTheme } from '.';
import KVInput from './KVInput';

import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider components={{ Input: inputTheme, KVInput: kvInputTheme }}>{children}</Provider>
);

describe('KVInput Tests', () => {
  it('names its group of pairs with its label', () => {
    render(<KVInput label="Headers" value={[['accept', 'json']]} />, { wrapper });

    expect(screen.getByLabelText('Headers')).toBe(screen.getByRole('group', { name: 'Headers' }));
  });

  it('keeps the id it is given for its label', () => {
    render(<KVInput id="headers" label="Headers" />, { wrapper });

    expect(screen.getByText('Headers')).toHaveAttribute('id', 'headers-label');
  });

  it('describes its group with the error message', () => {
    render(<KVInput label="Headers" error="Duplicated key" />, { wrapper });

    expect(screen.getByRole('group', { name: 'Headers' })).toHaveAccessibleDescription('Duplicated key');
  });
});
