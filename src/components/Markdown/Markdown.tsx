import clsx from 'clsx';
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
// import rehypeRaw from 'rehype-raw'; // disabled because we dont need to render RAW html
import remarkGfm from 'remark-gfm';

import useTheme from '@hooks/useTheme';

import { markdownComponents } from './helpers/markdownComponents';
import { rehypeHeadingAnchors } from './helpers/rehypeHeadingAnchors';

import type { MarkdownClassNames } from './helpers/markdownComponents';
import type { HeadingAnchor } from './helpers/rehypeHeadingAnchors';
import type MarkdownStyles from './Markdown.styles';
import type { variantKeys } from './Markdown.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type { MarkdownClassNames, MarkdownPart } from './helpers/markdownComponents';

export type MarkdownProps = {
  children?: string;
  wrapLines?: boolean;
  showLineNumbers?: boolean;
  /**
   * The id each heading carries, so `#id` lands on it — asked once per heading, in order, with the ids already given.
   * Without it a heading carries none and offers no link to itself.
   */
  headingAnchor?: HeadingAnchor;
  /**
   * Whether a heading that has an id offers a link to itself (`a.anchor`) before its words. `false` keeps the ids — a
   * `#id` still lands on the heading — and leaves the link out.
   */
  headingLinks?: boolean;
  /**
   * A class for each part of the output, beside the one it already has: `{ heading: 'doc-heading', link: 'doc-link' }`.
   * Keep it the same object from one render to the next: a new one rebuilds every tag of the document.
   */
  classNames?: MarkdownClassNames;
} & useThemeSharedProps<typeof MarkdownStyles, typeof variantKeys>;

const NO_CLASS_NAMES: MarkdownClassNames = {};

const remarkPlugins = [remarkGfm];

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
const getLang = (mod: any) => mod?.default || mod;

SyntaxHighlighter.registerLanguage('javascript', getLang(js));
SyntaxHighlighter.registerLanguage('typescript', getLang(ts));
SyntaxHighlighter.registerLanguage('jsx', getLang(jsx));
SyntaxHighlighter.registerLanguage('tsx', getLang(tsx));
SyntaxHighlighter.registerLanguage('bash', getLang(bash));
SyntaxHighlighter.registerLanguage('json', getLang(json));
SyntaxHighlighter.registerLanguage('css', getLang(css));
SyntaxHighlighter.registerLanguage('html', getLang(markup));
SyntaxHighlighter.registerLanguage('markdown', getLang(markup));

const Markdown = ({
  className,
  children = '',
  wrapLines = true,
  showLineNumbers = true,
  headingAnchor,
  headingLinks = true,
  classNames = NO_CLASS_NAMES
}: MarkdownProps) => {
  className = useTheme<typeof MarkdownStyles, typeof variantKeys>('Markdown', {
    className,
    componentKey: 'root'
  });
  const rehypePlugins = useMemo(() => (headingAnchor ? [rehypeHeadingAnchors(headingAnchor)] : []), [headingAnchor]);
  const components = useMemo(
    () => markdownComponents({ classNames, headingLinks, wrapLines, showLineNumbers }),
    [classNames, headingLinks, wrapLines, showLineNumbers]
  );

  return (
    <div className={clsx('markdown', className)}>
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
