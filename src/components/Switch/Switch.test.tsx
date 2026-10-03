import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Provider from '@components/Provider';

import { switchTheme } from '.';
import Switch from './Switch';

describe('Switch Tests', () => {
  it('should render successfully', () => {
    const component = render(<Switch />, {
      wrapper: ({ children }) => <Provider components={{ Switch: switchTheme }}>{children}</Provider>
    });

    expect(component.baseElement).toBeTruthy();
    expect(component.container.firstChild).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    const component = render(<Switch size="lg" className="customClass" />, {
      wrapper: ({ children }) => <Provider components={{ Switch: switchTheme }}>{children}</Provider>
    });

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('h-7 w-12').length).toBe(1);
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
  });

  it('labels its switch', () => {
    render(<Switch label="Dark mode" />);

    expect(screen.getByLabelText('Dark mode')).toBe(screen.getByRole('checkbox'));
  });

  it('keeps the id it is given', () => {
    render(<Switch id="dark-mode" label="Dark mode" />);

    expect(screen.getByLabelText('Dark mode')).toHaveAttribute('id', 'dark-mode');
  });

  it('describes its switch with the error message', () => {
    render(<Switch label="Dark mode" error="Not available" />);

    const input = screen.getByLabelText('Dark mode');
    expect(input).toHaveAccessibleDescription('Not available');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
