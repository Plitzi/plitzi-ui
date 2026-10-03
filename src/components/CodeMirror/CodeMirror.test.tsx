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

  it('does not tell onChange of a value the caller gave it, whichever callback came with it', async () => {
    // One editor, two files: the second opened with the callback that writes into it.
    const first = vi.fn();
    const second = vi.fn();
    const { container, rerender } = render(<CodeMirror mode="ts" value="const a = 1;" onChange={first} />);
    await waitFor(() => expect(container.querySelector('.cm-content')?.textContent).toBe('const a = 1;'));

    rerender(<CodeMirror mode="ts" value="const b = 2;" onChange={second} />);
    await waitFor(() => expect(container.querySelector('.cm-content')?.textContent).toBe('const b = 2;'));

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it('tells the latest onChange of what is typed', async () => {
    let view: EditorView | undefined;
    const extensions = [EditorView.updateListener.of(update => (view = update.view))];
    const stale = vi.fn();
    const latest = vi.fn();
    const { rerender } = render(<CodeMirror value="" onChange={stale} extensions={extensions} />);
    rerender(<CodeMirror value="" onChange={latest} extensions={extensions} />);
    await waitFor(() => expect(view).toBeDefined());

    view?.dispatch({ changes: { from: 0, insert: 'typed' } });

    expect(stale).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledWith('typed', expect.anything());
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

  it('labels its editor', async () => {
    render(<CodeMirror label="Custom CSS" />);

    await waitFor(() => expect(screen.getByLabelText('Custom CSS')).toBe(screen.getByRole('textbox')));
  });

  it('keeps the id it is given', async () => {
    render(<CodeMirror id="custom-css" label="Custom CSS" />);

    await waitFor(() => expect(screen.getByLabelText('Custom CSS')).toHaveAttribute('id', 'custom-css'));
  });

  it('marks its editor invalid on error', async () => {
    render(<CodeMirror label="Custom CSS" error />);

    await waitFor(() => expect(screen.getByLabelText('Custom CSS')).toHaveAttribute('aria-invalid', 'true'));
  });

  it('describes its editor with the error message', async () => {
    render(<CodeMirror label="Custom CSS" error="Unclosed block" />);

    await waitFor(() => expect(screen.getByLabelText('Custom CSS')).toHaveAccessibleDescription('Unclosed block'));
  });
});
