import { acceptCompletion, autocompletion } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { css, cssLanguage } from '@codemirror/lang-css';
import { html, htmlLanguage } from '@codemirror/lang-html';
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { json, jsonLanguage } from '@codemirror/lang-json';
import { EditorState, Transaction } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { useCallback, useMemo, useRef } from 'react';

import useTheme from '@hooks/useTheme';

import useCodeMirror from './hooks/useCodeMirror';

import type CodeMirrorStyles from './CodeMirror.styles';
import type { variantKeys } from './CodeMirror.styles';
import type { Completion, CompletionContext, CompletionSource } from '@codemirror/autocomplete';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { KeyboardEvent, RefObject } from 'react';

export type AutoComplete = string | { type: 'token' | 'css-token' | 'custom-token'; value: string; detail?: string };

const autoCompleteDefault: AutoComplete[] = [];

export type CodeMirrorProps = {
  ref?: RefObject<HTMLElement>;
  value?: string;
  mode?: 'css' | 'js' | 'json' | 'text' | 'html';
  theme?: 'light' | 'dark' | 'none';
  lineWrapping?: boolean;
  autoComplete?: AutoComplete[];
  multiline?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  getReadOnlyRanges?: (state: EditorState) => { from: number | null; to: number | null }[];
} & useThemeSharedProps<typeof CodeMirrorStyles, typeof variantKeys>;

const CodeMirror = ({
  ref,
  className,
  value = '',
  mode = 'css',
  theme = 'light',
  autoComplete = autoCompleteDefault,
  onChange,
  lineWrapping = false,
  multiline = true,
  readOnly = false,
  placeholder = '',
  getReadOnlyRanges
}: CodeMirrorProps) => {
  className = useTheme<typeof CodeMirrorStyles, typeof variantKeys>('CodeMirror', {
    className,
    componentKey: 'root',
    variant: {}
  });
  const basicSetupMemo = useMemo(() => ({ lineNumbers: multiline, foldGutter: multiline }), [multiline]);
  const styleMemo = useMemo(() => ({ height: '100%' }), []);
  const getRanges = useRef(getReadOnlyRanges);
  if (getRanges.current !== getReadOnlyRanges) {
    getRanges.current = getReadOnlyRanges;
  }

  const readOnlyTransactionFilter = useCallback(
    () =>
      EditorState.transactionFilter.of(tr => {
        if (!getRanges.current) {
          return tr;
        }

        const rangesBeforeTransaction = getRanges.current(tr.startState);
        const rangesAfterTransaction = getRanges.current(tr.state);
        let block: boolean = false;
        if (tr.docChanged && !tr.annotation(Transaction.remote) && tr.scrollIntoView) {
          rangesBeforeTransaction.forEach((beforeTransition, i) => {
            const { from: bFrom, to: bTo } = beforeTransition;
            if (!rangesAfterTransaction[i] || block) {
              block = true;

              return;
            }

            const { from: aFrom, to: aTo } = rangesAfterTransaction[i];
            const tFromBefore = bFrom ?? 0;
            const tToBefore = bTo ?? tr.startState.doc.line(tr.startState.doc.lines).to;
            const tFromAfter = aFrom ?? 0;
            const tToAfter = aTo ?? tr.state.doc.line(tr.state.doc.lines).to;

            if (tr.startState.sliceDoc(tFromBefore, tToBefore) !== tr.state.sliceDoc(tFromAfter, tToAfter)) {
              block = true;
            }
          });
        }

        return tr;
      }),
    []
  );

  const autoCompleteOptions = useMemo<Completion[]>(() => {
    if (!Array.isArray(autoComplete)) {
      return [];
    }

    return autoComplete
      .filter(tag => tag && (typeof tag === 'string' || ['css-token', 'token', 'custom-token'].includes(tag.type)))
      .map(tag => {
        if (typeof tag === 'string') {
          return { label: tag, type: 'keyword', apply: tag, detail: '(Raw Token)' };
        }

        if (tag.type === 'css-token') {
          return { label: tag.value, type: 'keyword', apply: `var(--${tag.value})`, detail: '(Css Token)' };
        }

        if (tag.type === 'token') {
          return { label: tag.value, type: 'keyword', apply: `{{${tag.value}}}`, detail: '(Token)' };
        }

        return { label: tag.value, type: 'keyword', apply: tag.value, detail: tag.detail ?? '(Custom Token)' };
      });
  }, [autoComplete]);

  const autoCompleteHandler = useCallback(
    (context: CompletionContext) => {
      const word = context.matchBefore(/[a-zA-Z0-9._-]+/);
      if (!word || (word.from === word.to && !context.explicit) || !autoCompleteOptions.length) {
        return undefined;
      }

      return { from: word.from, options: autoCompleteOptions };
    },
    [autoCompleteOptions]
  ) as CompletionSource;

  const extensions = useMemo(() => {
    const extensionsInternal = [
      readOnlyTransactionFilter(),
      keymap.of([{ key: 'Tab', run: acceptCompletion }]),
      keymap.of([indentWithTab])
    ];
    if (mode === 'js') {
      extensionsInternal.push(javascript({ jsx: true }));
      extensionsInternal.push(javascriptLanguage.data.of({ autocomplete: autoCompleteHandler }));
    } else if (mode === 'css') {
      extensionsInternal.push(css());
      extensionsInternal.push(cssLanguage.data.of({ autocomplete: autoCompleteHandler }));
    } else if (mode === 'json') {
      extensionsInternal.push(json());
      extensionsInternal.push(jsonLanguage.data.of({ autocomplete: autoCompleteHandler }));
    } else if (mode === 'html') {
      extensionsInternal.push(html());
      extensionsInternal.push(htmlLanguage.data.of({ autocomplete: autoCompleteHandler }));
    } else {
      extensionsInternal.push(autocompletion({ override: [autoCompleteHandler] }));
    }

    if (lineWrapping) {
      extensionsInternal.push(EditorView.lineWrapping);
    }

    return extensionsInternal;
  }, [readOnlyTransactionFilter, mode, lineWrapping, autoCompleteHandler]);

  const { editorRef } = useCodeMirror({
    extensions,
    theme,
    style: styleMemo,
    basicSetup: basicSetupMemo,
    placeholder,
    multiline,
    readOnly,
    value,
    onChange,
    ref
  });

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  return <div className={className} ref={editorRef} onKeyDown={handleKeyDown} />;
};

export default CodeMirror;
