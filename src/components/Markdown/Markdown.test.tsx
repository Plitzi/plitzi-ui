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

    it('keep their ids and offer no link to themselves with headingLinks off', () => {
      const { container } = render(
        <Markdown headingAnchor={anchor} headingLinks={false}>
          {'## One import'}
        </Markdown>
      );

      expect(container.querySelector('h2')?.id).toBe('one-import');
      expect(container.querySelector('a.anchor')).toBeNull();
      expect(container.querySelector('h2')?.textContent).toBe('One import');
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

  describe('the class of each part', () => {
    const classNames = {
      heading: 'doc-heading',
      paragraph: 'doc-p',
      link: 'doc-link',
      list: 'doc-list',
      listItem: 'doc-item',
      quote: 'doc-quote',
      code: 'doc-code',
      codeBlock: 'doc-block',
      image: 'doc-image',
      table: 'doc-table',
      anchor: 'doc-anchor'
    };
    const source = [
      '## Title',
      'A [link](https://plitzi.com) and `code`.',
      '- one\n- two',
      '1. first',
      '> said',
      '![A fox](/fox.jpg)',
      '| a |\n| - |\n| b |',
      '```ts\nconst a = 1;\n```'
    ].join('\n\n');

    it('puts each part under the class given for it', () => {
      const { container } = render(
        <Markdown classNames={classNames} headingAnchor={() => 'title'}>
          {source}
        </Markdown>
      );
      const classOf = (selector: string) => container.querySelector(selector)?.getAttribute('class');

      expect(classOf('h2')).toBe('doc-heading');
      expect(classOf('h2 > a')).toBe('anchor doc-anchor');
      expect(classOf('p')).toBe('doc-p');
      expect(classOf('p > a')).toBe('doc-link');
      expect(classOf('p > code')).toBe('doc-code');
      expect(classOf('ul')).toBe('doc-list');
      expect(classOf('ol')).toBe('doc-list');
      expect(classOf('li')).toBe('doc-item');
      expect(classOf('blockquote')).toBe('doc-quote');
      expect(classOf('img')).toBe('doc-image');
      expect(classOf('table')).toBe('doc-table');
      expect(classOf('pre')).toBe('doc-block');
    });

    it('keeps the class a part already had beside its own', () => {
      const { container } = render(<Markdown classNames={classNames}>{'- [x] done'}</Markdown>);

      expect(container.querySelector('ul')?.classList.contains('contains-task-list')).toBe(true);
      expect(container.querySelector('ul')?.classList.contains('doc-list')).toBe(true);
    });

    it('writes no class at all on a part nobody gave one', () => {
      const { container } = render(<Markdown>{'Plain words.'}</Markdown>);

      expect(container.querySelector('p')?.hasAttribute('class')).toBe(false);
    });
  });
});
