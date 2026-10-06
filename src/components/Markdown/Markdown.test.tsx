import { act, fireEvent, render } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, it, expect, vi } from 'vitest';

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

  describe('headings', () => {
    // What a consumer supplies: the same words always get the same id, numbered the second time.
    const anchor = (text: string, taken: Set<string>) => {
      const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const id = taken.has(base) ? `${base}-2` : base;
      taken.add(id);

      return id;
    };

    it('carry the id the consumer gives them, with a link to themselves', () => {
      const { container } = render(
        <Markdown headingAnchor={anchor}>{'## One `import`\n\n### Two\n\n## One import'}</Markdown>
      );
      const headings = [...container.querySelectorAll('h2, h3')];

      expect(headings.map(heading => heading.id)).toEqual(['one-import', 'two', 'one-import-2']);
      expect(headings[0].querySelector('a.anchor')?.getAttribute('href')).toBe('#one-import');
      expect(headings[0].querySelector('a.anchor')?.getAttribute('aria-label')).toBe('Link to “One import”');
    });

    it('keep their ids however many times React renders them', () => {
      const { container } = render(
        <StrictMode>
          <Markdown headingAnchor={anchor}>{'## Same\n\n## Same'}</Markdown>
        </StrictMode>
      );

      expect([...container.querySelectorAll('h2')].map(heading => heading.id)).toEqual(['same', 'same-2']);
    });

    it('carry no id and no link when nobody says what it is', () => {
      const { container } = render(<Markdown>{'## Plain'}</Markdown>);

      expect(container.querySelector('h2')?.hasAttribute('id')).toBe(false);
      expect(container.querySelector('a.anchor')).toBeNull();
    });
  });

  describe('a fenced block', () => {
    it('says what it is written in, and copies exactly its text', async () => {
      const writeText = vi.fn(() => Promise.resolve());
      Object.assign(navigator, { clipboard: { writeText } });
      const { container, getByRole } = render(<Markdown>{'```ts\nconst a = 1;\n```'}</Markdown>);

      expect(container.querySelector('.markdown-code-language')?.textContent).toBe('ts');
      await act(async () => {
        fireEvent.click(getByRole('button', { name: 'Copy' }));
        await Promise.resolve();
      });

      expect(writeText).toHaveBeenCalledWith('const a = 1;');
      expect(getByRole('button', { name: 'Copied' })).toBeTruthy();
    });

    it('without a language is still one, named as text', () => {
      const { container } = render(<Markdown>{'```\nplain\n```'}</Markdown>);

      expect(container.querySelector('.markdown-code-language')?.textContent).toBe('text');
    });
  });
});
