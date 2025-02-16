import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ThemeProvider from '@components/ThemeProvider';

// Relatives
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('should render successfully', () => {
    const component = render(<Checkbox />, { wrapper: ThemeProvider });

    expect(component.baseElement).toBeTruthy();
    expect(component.container.firstChild).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    const component = render(<Checkbox size="sm" className="customClass" />, { wrapper: ThemeProvider });

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('h-5 w-5').length).toBe(1);
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
  });
});
