// Packages
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import MetricInput from './MetricInput';

describe('MetricInput Tests', () => {
  it('Render Component', () => {
    render(<MetricInput placeholder="Text" />);

    const description = screen.getByPlaceholderText('Text');
    expect(description).toBeDefined();
  });
});
