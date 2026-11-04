import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ContainerFrame from './ContainerFrame';

describe('ContainerFrame', () => {
  it('writes its document as a string when nothing makes it trusted', () => {
    const { container } = render(<ContainerFrame />);

    expect(container.querySelector('iframe')?.getAttribute('srcdoc')).toMatch(/^<!DOCTYPE html><html><head>/);
  });

  // A page held to Trusted Types: the frame's document is handed through the page's own policy.
  it('hands its document to the page’s policy when it is given one', () => {
    const trustedHtml = vi.fn((html: string) => `${html}<!-- trusted -->`);
    const { container } = render(<ContainerFrame trustedHtml={trustedHtml} />);

    expect(trustedHtml).toHaveBeenCalledWith(expect.stringMatching(/^<!DOCTYPE html>/));
    expect(container.querySelector('iframe')?.getAttribute('srcdoc')).toContain('<!-- trusted -->');
  });
});
