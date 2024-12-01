// Packages
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Dummy from './Dummy';

describe('Dummy Tests', () => {
  it('Render Component', () => {
    render(<Dummy />);

    const description = screen.getByText('Dummy Component');
    expect(description).toBeDefined();
  });
});
