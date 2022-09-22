// Packages
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

// Relatives
import TextArea from './TextArea';

describe('TextArea', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TextArea />);

    expect(baseElement).toBeTruthy();
  });

  it('trigger events', async () => {
    // Test 1
    const handleChange = jest.fn();
    const component = render(<TextArea onChange={handleChange} />);
    const input = component.container.getElementsByTagName('textarea')[0];
    fireEvent.change(input, { target: { value: 'transformd' } });
    await waitFor(() => {
      expect(input.value).toBe('transformd');
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });
});
