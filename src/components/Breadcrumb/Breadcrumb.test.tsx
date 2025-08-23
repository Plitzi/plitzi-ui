import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Breadcrumb from './Breadcrumb';

describe('Breadcrumb', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Breadcrumb />);

    expect(baseElement).toBeTruthy();
  });

  it('should render items successfully', () => {
    const component = render(
      <Breadcrumb>
        <span>test</span>
        <span>hello world</span>
      </Breadcrumb>
    );

    expect(component.getByText(/test/i)).toBeTruthy();
    expect(component.getByText(/hello/i)).toBeTruthy();
  });

  it('should render custom classes successfully', () => {
    const component = render(<Breadcrumb className="customClass" />);

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
  });
});
