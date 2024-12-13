// Packages
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Text from './Text';

describe('Text Tests', () => {
  it('Render Component', () => {
    render(<Text>Hello World</Text>);

    const description = screen.getByText('Hello World');
    expect(description).toBeDefined();
  });
});
