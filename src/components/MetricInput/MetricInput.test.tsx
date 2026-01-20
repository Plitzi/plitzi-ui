import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

const user = userEvent.setup();

import MetricInput from './MetricInput';

describe('MetricInput', () => {
  const setup = (props: Partial<React.ComponentProps<typeof MetricInput>> = {}) => {
    const onChange = vi.fn();

    const Wrapper = () => {
      const [value, setValue] = React.useState(props.value ?? '');

      const handleChange = (v: string) => {
        setValue(v);
        onChange(v);
      };

      return (
        <MetricInput
          value={value}
          onChange={handleChange}
          units={[
            { label: 'px', value: 'px' },
            { label: 'rem', value: 'rem' }
          ]}
          {...props}
        />
      );
    };

    render(<Wrapper />);

    const input = screen.getByRole('textbox');

    return { input, onChange };
  };

  /* ---------------------------------------------------
   * BASIC RENDER
   * --------------------------------------------------- */

  it('renders correctly', () => {
    const { input } = setup();
    expect(input).toBeInTheDocument();
  });

  /* ---------------------------------------------------
   * NUMERIC INPUT
   * --------------------------------------------------- */

  it('accepts valid numeric value', async () => {
    const { input, onChange } = setup();

    await user.type(input, '12');

    expect(onChange).toHaveBeenLastCalledWith('12px');
  });

  it('rejects non-numeric input', async () => {
    const { input, onChange } = setup();

    await user.type(input, 'abc');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects min value', () => {
    const { input, onChange } = setup({ value: '0px', min: 0 });

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects max value', () => {
    const { input, onChange } = setup({ value: '10px', max: 10 });

    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(onChange).not.toHaveBeenCalled();
  });

  /* ---------------------------------------------------
   * UNITS
   * --------------------------------------------------- */

  // it('changes unit correctly', () => {
  //   const { onChange } = setup({ value: '10px' });

  //   fireEvent.click(screen.getByText('px'));
  //   fireEvent.click(screen.getByText('rem'));

  //   expect(onChange).toHaveBeenLastCalledWith('10rem');
  // });

  // it('does not append unit when value is empty', () => {
  //   const { onChange } = setup({ value: '' });

  //   fireEvent.click(screen.getByText('px'));

  //   expect(onChange).toHaveBeenLastCalledWith('0px');
  // });

  /* ---------------------------------------------------
   * KEYBOARD INTERACTION
   * --------------------------------------------------- */

  it('increments value with ArrowUp', () => {
    const { input, onChange } = setup({ value: '10px', step: 2 });

    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(onChange).toHaveBeenLastCalledWith('12px');
  });

  it('decrements value with ArrowDown', () => {
    const { input, onChange } = setup({ value: '10px', step: 2 });

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(onChange).toHaveBeenLastCalledWith('8px');
  });

  /* ---------------------------------------------------
   * ALLOWED WORDS
   * --------------------------------------------------- */

  it('accepts allowedWords', async () => {
    const { input, onChange } = setup({
      allowedWords: ['auto']
    });

    await user.type(input, 'auto');

    expect(onChange).toHaveBeenLastCalledWith('auto');
  });

  it('rejects words not in allowedWords', async () => {
    const { input, onChange } = setup({
      allowedWords: ['auto']
    });

    await user.type(input, 'inherit');

    expect(onChange).not.toHaveBeenCalled();
  });

  /* ---------------------------------------------------
   * CSS VARIABLES (FULL)
   * --------------------------------------------------- */

  it('accepts full css variable when allowVariables is enabled', async () => {
    const { input, onChange } = setup({ allowVariables: true });

    await user.type(input, 'var(--spacing-md)');

    expect(onChange).toHaveBeenLastCalledWith('var(--spacing-md)');
  });

  it('rejects css variable when allowVariables is false', async () => {
    const { input, onChange } = setup({ allowVariables: false });

    await user.type(input, 'var(--x)');

    expect(onChange).not.toHaveBeenCalled();
  });

  /* ---------------------------------------------------
   * CSS VARIABLES (PARTIAL / UX)
   * --------------------------------------------------- */

  it('allows partial css variable typing', async () => {
    const { input, onChange } = setup({ allowVariables: true });

    await user.type(input, 'var(--spa');

    expect(onChange).toHaveBeenLastCalledWith('var(--spa');
  });

  it('allows typing only "var(" progressively', async () => {
    const { input, onChange } = setup({ allowVariables: true });

    await user.type(input, 'var(');

    expect(onChange).toHaveBeenLastCalledWith('var(');
  });

  it('does not append units to css variable', async () => {
    const { input, onChange } = setup({ allowVariables: true });

    await user.type(input, 'var(--x)');
    fireEvent.click(screen.getByText('px'));

    expect(onChange).toHaveBeenLastCalledWith('');
  });

  /* ---------------------------------------------------
   * INVALID CSS VARIABLES
   * --------------------------------------------------- */

  // it('rejects invalid css variable syntax', async () => {
  //   const { input, onChange } = setup({ allowVariables: true });

  //   await user.type(input, 'var(x)');

  //   expect(onChange).not.toHaveBeenCalled();
  // });

  // it('rejects malformed css variable', async () => {
  //   const { input, onChange } = setup({ allowVariables: true });

  //   await user.type(input, 'var(--');

  //   expect(onChange).toHaveBeenLastCalledWith('var(--');
  // });

  /* ---------------------------------------------------
   * MIXED EDGE CASES
   * --------------------------------------------------- */

  it('ignores ArrowUp when value is css variable', () => {
    const { input, onChange } = setup({
      value: 'var(--x)',
      allowVariables: true
    });

    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles empty input safely', async () => {
    const { input, onChange } = setup();

    await user.clear(input);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('ignores invalid numeric patterns', async () => {
    const { input, onChange } = setup();

    await user.type(input, '--');

    expect(onChange).not.toHaveBeenCalled();
  });
});
