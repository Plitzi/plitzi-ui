import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import TextArea from './TextArea';

describe('Input Tests', () => {
  it('Render Component', () => {
    render(<TextArea placeholder="Text" />);

    const description = screen.getByPlaceholderText('Text');
    expect(description).toBeDefined();
  });
});
