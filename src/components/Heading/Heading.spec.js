// Packages
import React from 'react';
import { render } from '@testing-library/react';

// Relatives
import Heading from './Heading';

describe('Heading', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Heading>Hello World</Heading>);

    expect(baseElement).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    let component = render(
      <Heading type="h1" className="customClass">
        Hello World
      </Heading>
    );

    expect(component.container.firstChild).toBeTruthy();
    expect(component.container.getElementsByClassName('customClass').length).toBe(1);
    expect(component.getByText(/Hello World/i)).toBeTruthy();
    expect(component.container.getElementsByTagName('h1').length).toBe(1);

    component = render(<Heading label="Hello World" type="h2" className="customClass" />);
    expect(component.container.getElementsByTagName('h2').length).toBe(1);

    component = render(<Heading label="Hello World" type="h3" className="customClass" />);
    expect(component.container.getElementsByTagName('h3').length).toBe(1);

    component = render(<Heading label="Hello World" type="h4" className="customClass" />);
    expect(component.container.getElementsByTagName('h4').length).toBe(1);

    component = render(<Heading label="Hello World" type="h5" className="customClass" />);
    expect(component.container.getElementsByTagName('h5').length).toBe(1);

    component = render(<Heading label="Hello World" type={null} className="customClass" />);
    expect(component.container.firstChild).toBeNull();
  });
});
