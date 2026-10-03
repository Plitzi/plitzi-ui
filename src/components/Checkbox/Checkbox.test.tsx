import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Provider from '@components/Provider';

import { checkboxTheme } from '.';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('should render successfully', () => {
    const component = render(<Checkbox />, {
      wrapper: ({ children }) => <Provider components={{ Checkbox: checkboxTheme }}>{children}</Provider>
    });

    expect(component.baseElement).toBeTruthy();
    expect(component.container.firstChild).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    const component = render(<Checkbox size="sm" className="customClass" />, {
      wrapper: ({ children }) => <Provider components={{ Checkbox: checkboxTheme }}>{children}</Provider>
    });

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('h-5 w-5').length).toBe(1);
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
  });

  it('labels its checkbox', () => {
    render(<Checkbox label="Visible" />);

    expect(screen.getByLabelText('Visible')).toBe(screen.getByRole('checkbox'));
  });

  it('keeps the id it is given', () => {
    render(<Checkbox id="visible" label="Visible" />);

    expect(screen.getByLabelText('Visible')).toHaveAttribute('id', 'visible');
  });

  it('describes its checkbox with the error message', () => {
    render(<Checkbox label="Accept terms" error="Required" />);

    const checkbox = screen.getByLabelText('Accept terms');
    expect(checkbox).toHaveAccessibleDescription('Required');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });
});
