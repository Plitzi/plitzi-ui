import { useCallback, useEffect, useState } from 'react';

import type { ReactNode } from 'react';

export type CodeBlockProps = {
  /** The language the block is written in, as its fence named it. */
  language?: string;
  /** The block's text, as it is copied. */
  code: string;
  children?: ReactNode;
};

/** How long "Copied" stays before the button reads "Copy" again. */
const COPIED_MS = 2000;

/** A fenced block with what it is written in and a way to take it: a header over the code itself. */
const CodeBlock = ({ language, code, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timer = setTimeout(() => setCopied(false), COPIED_MS);

    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(code).then(() => setCopied(true));
  }, [code]);

  return (
    <div className="markdown-code" data-language={language}>
      <div className="markdown-code-header">
        <span className="markdown-code-language">{language ?? 'text'}</span>
        <button type="button" className="markdown-code-copy" onClick={handleCopy} aria-live="polite">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {children}
    </div>
  );
};

export default CodeBlock;
