import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Sidebar from './Sidebar';

describe('a sidebar icon', () => {
  // A rail's entry was an `<i>` with a title: no keyboard reached it, and a screen reader said nothing of it.
  it('is a button named by its title, pressed when open, that Enter and Space press', () => {
    const onChange = vi.fn();
    render(
      <Sidebar value={['elements']} onChange={onChange}>
        <Sidebar.Icon id="elements" icon="fa-solid fa-plus" title="Elements" />
        <Sidebar.Icon id="layers" icon="fa-solid fa-layer-group" title="Layers" />
      </Sidebar>
    );

    const layers = screen.getByRole('button', { name: 'Layers' });
    expect(layers.getAttribute('tabindex')).toBe('0');
    expect(screen.getByRole('button', { name: 'Elements' }).getAttribute('aria-pressed')).toBe('true');
    expect(layers.getAttribute('aria-pressed')).toBe('false');

    fireEvent.keyDown(layers, { key: 'Enter' });
    fireEvent.keyDown(layers, { key: ' ' });
    fireEvent.keyDown(layers, { key: 'a' });

    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
