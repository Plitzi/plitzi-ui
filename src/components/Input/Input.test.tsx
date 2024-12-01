// Packages
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Input from './Input';

describe('Input Tests', () => {
  it('Render Component', () => {
    render(<Input placeholder="Text" />);

    const description = screen.getByPlaceholderText('Text');
    expect(description).toBeDefined();
  });
});
