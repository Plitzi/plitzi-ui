import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ContainerFloating from './ContainerFloating';

describe('ContainerFloating', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContainerFloating />);

    expect(baseElement).toBeTruthy();
  });

  it('trigger events', async () => {
    let component = render(<ContainerFloating />);
    if (!component.container.firstChild) {
      return;
    }

    fireEvent.click(component.container.firstChild);

    component = render(
      <ContainerFloating closeOnClick={false}>
        Invalid Child
        <div>Valid Child</div>
        <ContainerFloating.Trigger>
          <span>Hello World</span>
        </ContainerFloating.Trigger>
        <ContainerFloating.Content className="p-4">
          <ul>
            <li>
              <span>Option 1</span>
            </li>
          </ul>
        </ContainerFloating.Content>
      </ContainerFloating>
    );
    if (!component.container.firstChild) {
      return;
    }

    fireEvent.click(component.container.firstChild);
    await waitFor(async () => {
      fireEvent.click(component.container.getElementsByClassName('dropdown-container__root')[0]);
      await waitFor(() => {
        fireEvent.click(window.document.body);
      });
    });
  });
});
