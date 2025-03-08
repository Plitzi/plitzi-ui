import { render, screen } from '@testing-library/react';
import { describe, it, afterEach, expect, vi } from 'vitest';

import CodeMirror from './CodeMirror';

describe('CodeMirror', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Render Component', () => {
    render(<CodeMirror value="Hello World" />);

    const description = screen.getByText('Hello');
    expect(description).toBeDefined();

    const description2 = screen.getByText('World');
    expect(description2).toBeDefined();
  });

  it('trigger events', () => {
    // Test 1
    const handleChange = vi.fn();
    const component = render(<CodeMirror onChange={handleChange} />);
    expect(component).toBeTruthy();
    // const input = component.container.getElementsByTagName('textarea')[0];
    // fireEvent.change(input, { target: { value: 'plitzi' } });
    // await waitFor(() => {
    //   expect(input.value).toBe('plitzi');
    //   expect(handleChange).toHaveBeenCalledTimes(1);
    // });
  });
});
