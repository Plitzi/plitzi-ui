import clsx from 'clsx';
import omit from 'lodash-es/omit.js';
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

import useTheme from '@hooks/useTheme';

import type MarkdownStyles from './Markdown.styles';
import type { variantKeys } from './Markdown.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties } from 'react';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';

export type MarkdownProps = {
  children?: string;
  wrapLines?: boolean;
  showLineNumbers?: boolean;
} & useThemeSharedProps<typeof MarkdownStyles, typeof variantKeys>;

const remarkPlugins = [remarkGfm];
// const rehypePlugins = [rehypeRaw];

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('markdown', markup);

const Markdown = ({ className, children = '', wrapLines = true, showLineNumbers = true }: MarkdownProps) => {
  className = useTheme<typeof MarkdownStyles, typeof variantKeys>('Markdown', {
    className,
    componentKey: 'root'
  });

  return (
    <div className={clsx('markdown', className)}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        // rehypePlugins={rehypePlugins}
        components={{
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            if (match) {
              return (
                <SyntaxHighlighter
                  {...(omit(rest, ['node']) as SyntaxHighlighterProps)}
                  PreTag="div"
                  language={match[1]}
                  style={vscDarkPlus as { [key: string]: CSSProperties }}
                  wrapLines={wrapLines}
                  showLineNumbers={showLineNumbers}
                  children={typeof children === 'string' ? children.replace(/\n$/, '') : ''}
                />
              );
            }

            return (
              <code {...rest} className={className}>
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
