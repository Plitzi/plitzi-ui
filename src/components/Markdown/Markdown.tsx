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
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
// import rehypeRaw from 'rehype-raw'; // disabled because we dont need to render RAW html
import remarkGfm from 'remark-gfm';

import { omit } from '@/helpers/lodash';
import useTheme from '@hooks/useTheme';

import CodeBlock from './components/CodeBlock';
import { hastText } from './helpers/hastText';
import { rehypeHeadingAnchors } from './helpers/rehypeHeadingAnchors';

import type { HeadingAnchor } from './helpers/rehypeHeadingAnchors';
import type MarkdownStyles from './Markdown.styles';
import type { variantKeys } from './Markdown.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ComponentProps } from 'react';
import type { ExtraProps } from 'react-markdown';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';

export type MarkdownProps = {
  children?: string;
  wrapLines?: boolean;
  showLineNumbers?: boolean;
  /**
   * The id each heading carries, so `#id` lands on it — asked once per heading, in order, with the ids already given.
   * Without it a heading carries none and offers no link to itself.
   */
  headingAnchor?: HeadingAnchor;
} & useThemeSharedProps<typeof MarkdownStyles, typeof variantKeys>;

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

const LANGUAGE = /language-(\w+)/;

/** A heading with a link to itself before its words, when it has an id to link to. */
const heading =
  (Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') =>
  ({ children, node, ...rest }: ComponentProps<typeof Tag> & ExtraProps) => (
    <Tag {...rest}>
      {rest.id ? (
        <a className="anchor" href={`#${rest.id}`} aria-label={`Link to “${node ? hastText(node) : rest.id}”`}>
          <span className="octicon octicon-link" aria-hidden="true" />
        </a>
      ) : null}
      {children}
    </Tag>
  );

/** A fenced block, with its language and a copy button over it; any other `pre` stays as it is. */
const Pre = ({ children, node, ...rest }: ComponentProps<'pre'> & ExtraProps) => {
  const code = node?.children.find(child => child.type === 'element' && child.tagName === 'code');
  if (!code || code.type !== 'element') {
    return <pre {...rest}>{children}</pre>;
  }

  const classNames = code.properties.className;
  const language = Array.isArray(classNames)
    ? classNames
        .map(String)
        .map(name => LANGUAGE.exec(name)?.[1])
        .find(Boolean)
    : undefined;

  return (
    <CodeBlock language={language} code={hastText(code).replace(/\n$/, '')}>
      <pre {...rest}>{children}</pre>
    </CodeBlock>
  );
};

const HEADING_COMPONENTS = {
  h1: heading('h1'),
  h2: heading('h2'),
  h3: heading('h3'),
  h4: heading('h4'),
  h5: heading('h5'),
  h6: heading('h6')
};

const Markdown = ({
  className,
  children = '',
  wrapLines = true,
  showLineNumbers = true,
  headingAnchor
}: MarkdownProps) => {
  className = useTheme<typeof MarkdownStyles, typeof variantKeys>('Markdown', {
    className,
    componentKey: 'root'
  });
  const rehypePlugins = useMemo(() => (headingAnchor ? [rehypeHeadingAnchors(headingAnchor)] : []), [headingAnchor]);

  return (
    <div className={clsx('markdown', className)}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          ...HEADING_COMPONENTS,
          pre: Pre,
          code(props) {
            // `node` is react-markdown's own syntax-tree node, not an attribute: spread onto a tag it reaches the HTML as
            // `node="[object Object]"`.
            const { children, className, ...rest } = props;
            const attributes = omit(rest, ['node']);
            const match = LANGUAGE.exec(className || '');
            if (match) {
              return (
                <SyntaxHighlighter
                  {...(attributes as SyntaxHighlighterProps)}
                  PreTag="div"
                  language={match[1]}
                  style={vscDarkPlus}
                  wrapLines={wrapLines}
                  showLineNumbers={showLineNumbers}
                  children={typeof children === 'string' ? children.replace(/\n$/, '') : ''}
                />
              );
            }

            return (
              <code {...attributes} className={className}>
                {children}
              </code>
            );
          }
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
