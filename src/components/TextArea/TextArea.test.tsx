// Packages
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Relatives
import TextArea from './TextArea';

describe('Input Tests', () => {
  it('Render Component', () => {
    render(<TextArea placeholder="Text" />);

    const description = screen.getByPlaceholderText('Text');
    expect(description).toBeDefined();
  });
});
