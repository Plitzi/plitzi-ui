import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Button from './Button';

describe('Button Tests', () => {
  it('Render Component', () => {
    render(<Button>Button</Button>);

    const description = screen.getByText('Button');
    expect(description).toBeDefined();
  });
});
