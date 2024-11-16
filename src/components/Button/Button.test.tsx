// Packages
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Relatives
import Button from './Button';

describe('Button Tests', () => {
  it('Render Component', () => {
    render(<Button />);

    const description = screen.getByText('Button');
    expect(description).toBeDefined();
  });
});
