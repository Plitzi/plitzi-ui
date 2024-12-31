// Packages
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('should render successfully', () => {
    const component = render(<Checkbox />);

    expect(component.baseElement).toBeTruthy();
    expect(component.container.firstChild).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    const component = render(<Checkbox size="sm" className="customClass" />);

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('h-6 w-6').length).toBe(1);
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
  });
});
