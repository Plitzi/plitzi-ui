import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Provider from '@components/Provider';

// Relatives
import Switch from './Switch';

describe('Switch Tests', () => {
  it('should render successfully', () => {
    const component = render(<Switch />, { wrapper: Provider });

    expect(component.baseElement).toBeTruthy();
    expect(component.container.firstChild).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    const component = render(<Switch size="lg" className="customClass" />, { wrapper: Provider });

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('h-7 w-12').length).toBe(1);
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
  });
});
