import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import TextArea from './TextArea';

describe('TextArea Tests', () => {
  it('Render Component', () => {
    render(<TextArea placeholder="Text" />);

    const description = screen.getByPlaceholderText('Text');
    expect(description).toBeDefined();
  });

  it('labels its textarea', () => {
    render(<TextArea label="Description" />);

    expect(screen.getByLabelText('Description')).toBe(screen.getByRole('textbox'));
  });

  it('keeps the id it is given', () => {
    render(<TextArea id="description" label="Description" />);

    expect(screen.getByLabelText('Description')).toHaveAttribute('id', 'description');
  });

  it('describes its textarea with the error message', () => {
    render(<TextArea label="Description" error="Too long" />);

    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAccessibleDescription('Too long');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });
});
