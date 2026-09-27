import { EditorView } from '@codemirror/view';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, afterEach, expect, vi, beforeAll } from 'vitest';

import CodeMirror from './CodeMirror';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  global.IntersectionObserver = class {
    root = null;
    rootMargin = '';
    thresholds = [];
    scrollMargin = '';
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
});

describe('CodeMirror', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Render Component', () => {
    render(<CodeMirror value="Hello World" />);

    const description = screen.getByText('Hello World');
    expect(description).toBeDefined();
  });

  it('trigger events', () => {
    // Test 1
    const handleChange = vi.fn(() => {});
    const component = render(<CodeMirror onChange={handleChange} />);
    expect(component).toBeTruthy();
    // const input = component.container.getElementsByTagName('textarea')[0];
    // fireEvent.change(input, { target: { value: 'plitzi' } });
    // await waitFor(() => {
    //   expect(input.value).toBe('plitzi');
    //   expect(handleChange).toHaveBeenCalledTimes(1);
    // });
  });

  it('highlights TypeScript, and takes extensions of the caller', async () => {
    const updates = vi.fn();
    const extensions = [EditorView.updateListener.of(updates)];
    const { container } = render(<CodeMirror mode="ts" value="const n: number = 1;" extensions={extensions} />);

    await waitFor(() => {
      expect(container.querySelector('.cm-content')?.textContent).toBe('const n: number = 1;');
      expect(updates).toHaveBeenCalled();
    });
  });
});
