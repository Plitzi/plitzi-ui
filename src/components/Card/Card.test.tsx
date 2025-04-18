import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Card from './Card';

describe('Card Tests', () => {
  it('Render Component', () => {
    const { baseElement } = render(<Card />);

    expect(baseElement).toBeTruthy();
  });
});
