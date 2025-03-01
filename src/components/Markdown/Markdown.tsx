import classNames from 'classnames';
import omit from 'lodash/omit';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
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
const rehypePlugins = [rehypeRaw];

const Markdown = ({ className, children = '', wrapLines = true, showLineNumbers = true }: MarkdownProps) => {
  className = useTheme<typeof MarkdownStyles, typeof variantKeys>('Markdown', {
    className,
    componentKey: 'root',
    variant: {}
  });

  return (
    <div className={classNames('markdown', className)}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
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
                  children={String(children as string).replace(/\n$/, '')}
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
