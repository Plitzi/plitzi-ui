// Packages
import React from 'react';
import { render } from '@testing-library/react';

// Relatives
import Card from './Card';

describe('Card', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Card />);

    expect(baseElement).toBeTruthy();
  });
});
