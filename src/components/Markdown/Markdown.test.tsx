import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Markdown from './Markdown';

describe('Markdown', () => {
  it('writes inline code with nothing of the syntax tree on the tag', () => {
    const { container } = render(<Markdown>{'## `pull`\n\nRun `plitzi pull`.'}</Markdown>);
    const codes = [...container.querySelectorAll('code')];

    expect(codes.map(code => code.textContent)).toEqual(['pull', 'plitzi pull']);
    codes.forEach(code => expect(code.hasAttribute('node')).toBe(false));
  });

  it('writes a fenced block highlighted, without the syntax tree either', () => {
    const { container } = render(<Markdown>{'```ts\nconst a = 1;\n```'}</Markdown>);

    expect(container.textContent).toContain('const a = 1;');
    expect(container.querySelector('[node]')).toBeNull();
  });
});
