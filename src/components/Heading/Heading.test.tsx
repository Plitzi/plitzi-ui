// Packages
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Heading from './Heading';

describe('Heading', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Heading>Hello World</Heading>);

    expect(baseElement).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    let component = render(
      <Heading as="h1" className="customClass">
        Hello World
      </Heading>
    );

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
    expect(component.getByText(/Hello World/i)).toBeTruthy();
    expect(component.container.getElementsByTagName('h1').length).toBe(1);

    component = render(
      <Heading as="h2" className="customClass">
        Hello World
      </Heading>
    );
    expect(component.container.getElementsByTagName('h2').length).toBe(1);

    component = render(
      <Heading as="h3" className="customClass">
        Hello World
      </Heading>
    );
    expect(component.container.getElementsByTagName('h3').length).toBe(1);

    component = render(
      <Heading as="h4" className="customClass">
        Hello World
      </Heading>
    );
    expect(component.container.getElementsByTagName('h4').length).toBe(1);

    component = render(
      <Heading as="h5" className="customClass">
        Hello World
      </Heading>
    );
    expect(component.container.getElementsByTagName('h5').length).toBe(1);

    component = render(
      <Heading as="h6" className="customClass">
        Hello World
      </Heading>
    );
    expect(component.container.getElementsByTagName('h6').length).toBe(1);
  });
});
