// Packages
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Relatives
import Dummy from './Dummy';

describe('Dummy Tests', () => {
  it('Render Component', () => {
    render(<Dummy />);

    const description = screen.getByText('Dummy Component');
    expect(description).toBeInTheDocument();
  });
});
