// Packages
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Relatives
import MetricInput from './MetricInput';

describe('MetricInput Tests', () => {
  it('Render Component', () => {
    render(<MetricInput placeholder="Text" />);

    const description = screen.getByPlaceholderText('Text');
    expect(description).toBeDefined();
  });
});
