// Packages
import React from 'react';
import { render } from '@testing-library/react';

// Relatives
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('should render successfully', () => {
    const component = render(<Checkbox />);

    expect(component.baseElement).toBeTruthy();
    expect(component.container.firstChild).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    const component = render(<Checkbox size="lg" className="customClass" />);

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('h-6 w-6 mr-3').length).toBe(1);
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
  });
});
