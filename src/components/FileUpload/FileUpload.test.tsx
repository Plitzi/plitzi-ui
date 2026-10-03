import { render, screen } from '@testing-library/react';
import { beforeAll, describe, it, expect, vi } from 'vitest';

import FileUpload from './FileUpload';

beforeAll(() => {
  // jsdom has no DataTransfer, which FileUpload builds to keep its input's files in step with `value`.
  vi.stubGlobal(
    'DataTransfer',
    class {
      items = { add: () => undefined };

      get files() {
        const input = document.createElement('input');
        input.type = 'file';

        return input.files;
      }
    }
  );
});

describe('FileUpload Tests', () => {
  it('labels its file input', () => {
    const { container } = render(<FileUpload label="Avatar" />);

    expect(screen.getByLabelText('Avatar')).toBe(container.querySelector('input[type="file"]'));
  });

  it('keeps the id it is given', () => {
    render(<FileUpload id="avatar" label="Avatar" />);

    expect(screen.getByLabelText('Avatar')).toHaveAttribute('id', 'avatar');
  });

  it('describes its file input with the error message', () => {
    render(<FileUpload label="Avatar" error="File size is too big" />);

    const input = screen.getByLabelText('Avatar');
    expect(input).toHaveAccessibleDescription('File size is too big');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
