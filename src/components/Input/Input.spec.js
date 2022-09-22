// Packages
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

// Relatives
import Input from './Input';

describe('Input', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Input />);

    expect(baseElement).toBeTruthy();
  });

  it('trigger events', async () => {
    // Test 1
    let value = '';
    const handleChange = jest.fn(e => {
      value = e.target.value;
    });
    const { rerender, container } = await render(<Input onChange={handleChange} />);
    const input = container.getElementsByTagName('input')[0];
    fireEvent.change(input, { target: { value: 'transformd' } });
    await rerender(<Input onChange={handleChange} value={value} />);
    await waitFor(() => {
      expect(input.value).toBe('transformd');
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });
});
