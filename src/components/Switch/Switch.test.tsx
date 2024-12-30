// Packages
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Switch from './Switch';

describe('Switch Tests', () => {
  it('should render successfully', () => {
    const component = render(<Switch />);

    expect(component.baseElement).toBeTruthy();
    expect(component.container.firstChild).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    const component = render(<Switch size="lg" className="customClass" />);

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('h-8 w-20').length).toBe(1);
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
  });
});
