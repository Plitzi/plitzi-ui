import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Modal from './Modal';

describe('Modal Tests', () => {
  it('Render Component', () => {
    render(<Modal />);
  });

  it('closes on Escape, without the key reaching the page behind it', () => {
    const onClose = vi.fn();
    const behind = vi.fn();
    document.addEventListener('keydown', behind);
    render(<Modal open onClose={onClose} />);

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(behind).not.toHaveBeenCalled();
    document.removeEventListener('keydown', behind);
  });

  it('closes only the innermost of two open modals', () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <>
        <Modal open onClose={outer} />
        <Modal open onClose={inner} />
      </>
    );

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });

  it('lets an open dropdown inside it take the Escape first', () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <Modal open onClose={onClose}>
        <Modal.Body>
          <button type="button" aria-expanded="true">
            Pick
          </button>
        </Modal.Body>
      </Modal>
    );

    fireEvent.keyDown(getByRole('button', { name: 'Pick' }), { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('takes the focus when it opens', () => {
    const { getByRole } = render(<Modal open onClose={vi.fn()} />);

    expect(document.activeElement).toBe(getByRole('dialog'));
  });

  it('leaves other keys alone', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} />);

    fireEvent.keyDown(document.body, { key: 'Enter' });

    expect(onClose).not.toHaveBeenCalled();
  });
});
