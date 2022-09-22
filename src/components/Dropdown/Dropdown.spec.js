// Packages
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

// Relatives
import Dropdown from './Dropdown';

describe('Dropdown', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Dropdown />);

    expect(baseElement).toBeTruthy();
  });

  it('trigger events', () => {
    let component = render(<Dropdown />);
    if (!component || !component.container || !component.container.firstChild) {
      return;
    }

    fireEvent.click(component.container.firstChild);

    component = render(
      <Dropdown width={280} closeOnClick={false}>
        Invalid Child
        <div>Valid Child</div>
        <Dropdown.Content>
          <span>Hello World</span>
        </Dropdown.Content>
        <Dropdown.Container className="p-4">
          <ul>
            <li>
              <span>Option 1</span>
            </li>
          </ul>
        </Dropdown.Container>
      </Dropdown>
    );
    if (!component || !component.container || !component.container.firstChild) {
      return;
    }

    fireEvent.click(component.container.firstChild);

    waitFor(() => {
      fireEvent.click(component.container.getElementsByClassName('dropdown-container__root')[0]);

      waitFor(() => {
        fireEvent.click(window.document.body);
      });
    });
  });
});
