// Packages
import React from 'react';
import { render } from '@testing-library/react';

// Relatives
import Button from './Button';

describe('Button', () => {
  it('should render successfully', () => {
    const component = render(<Button title="Hello" />);

    expect(component.baseElement).toBeTruthy();
    expect(component.container.firstChild).toBeTruthy();

    if (!component.container.firstChild) {
      return;
    }

    expect(component.container.firstChild).toHaveProperty('title');
    expect(component.container.firstChild.title).toEqual('Hello');
  });

  it('should render custom props successfully', () => {
    const component = render(<Button size="lg" className="customClass" />);

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('py-2 px-5').length).toBe(1);
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
  });
});
