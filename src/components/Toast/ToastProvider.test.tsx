import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ToastProvider from './ToastProvider';
import useToast from './useToast';

import type { ToastContextValue } from './ToastContext';

const withToasts = () => {
  const handle: { addToast?: ToastContextValue['addToast'] } = {};
  const Capture = () => {
    handle.addToast = useToast().addToast;

    return null;
  };
  render(
    <ToastProvider containerId="toasts">
      <Capture />
    </ToastProvider>
  );

  return (...args: Parameters<ToastContextValue['addToast']>) => {
    act(() => {
      handle.addToast?.(...args);
    });
  };
};

/** Toastify mounts a toast on its next frame. */
const settle = async () => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
  });
};

describe('ToastProvider', () => {
  // A page in a background tab runs no animation, so no toast closes there: a refusal said on every refetch was a
  // column of the same toast when the person came back.
  it('shows a message once while it is on screen, however many times it is said', async () => {
    const addToast = withToasts();
    addToast('Authentication required', { appeareance: 'error' });
    addToast('Authentication required', { appeareance: 'error' });
    addToast('Authentication required', { appeareance: 'error' });
    await settle();

    expect(screen.getAllByText('Authentication required')).toHaveLength(1);
  });

  it('shows different messages, and the same text in another appearance, each', async () => {
    const addToast = withToasts();
    addToast('Saved', { appeareance: 'success' });
    addToast('Saved', { appeareance: 'warning' });
    addToast('Deleted', { appeareance: 'success' });
    await settle();

    expect(screen.getAllByText('Saved')).toHaveLength(2);
    expect(screen.getAllByText('Deleted')).toHaveLength(1);
  });

  it('knows an element by the id it is given', async () => {
    const addToast = withToasts();
    addToast(<span>Quota reached</span>, { id: 'quota' });
    addToast(<span>Quota reached</span>, { id: 'quota' });
    addToast(<span>Quota reached</span>);
    await settle();

    expect(screen.getAllByText('Quota reached')).toHaveLength(2);
  });
});
