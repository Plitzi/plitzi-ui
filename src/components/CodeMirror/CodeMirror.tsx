import { acceptCompletion, autocompletion } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { EditorState, Transaction } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

import { omit } from '@/helpers/lodash';
import useInputField from '@components/Input/hooks/useInputField';
import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

import useCodeMirror from './hooks/useCodeMirror';

import type CodeMirrorStyles from './CodeMirror.styles';
import type { variantKeys } from './CodeMirror.styles';
import type { StyleSpec } from './hooks/useCodeMirror';
import type { Completion, CompletionContext, CompletionSource } from '@codemirror/autocomplete';
import type { Extension } from '@codemirror/state';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type InputStyles from '@components/Input/Input.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { FocusEvent, KeyboardEvent, ReactNode, RefObject } from 'react';

export type AutoComplete = string | { type: 'token' | 'css-token' | 'custom-token'; value: string; detail?: string };

const autoCompleteDefault: AutoComplete[] = [];

export { EditorState, Transaction };

export type CodeMirrorProps = {
  ref?: RefObject<HTMLElement | null>;
  id?: string;
  label?: ReactNode;
  placeholder?: string;
  loading?: boolean;
  clearable?: boolean;
  value?: string;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  /** `ts` is TypeScript, without JSX. */
  mode?: 'css' | 'js' | 'ts' | 'json' | 'text' | 'html';
  theme?: 'light' | 'dark' | 'none';
  lineWrapping?: boolean;
  autoComplete?: AutoComplete[];
  multiline?: boolean;
  readOnly?: boolean;
  style?: StyleSpec;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent) => void;
  getReadOnlyRanges?: (state: EditorState) => { from: number | null; to: number | null }[];
  /**
   * More of CodeMirror's own extensions, after the editor's: a language service's diagnostics and hovers, a linter, a
   * keymap. Kept stable by the caller (a memo) — a new array reconfigures the editor.
   */
  extensions?: Extension[];
} & Omit<useThemeSharedProps<typeof CodeMirrorStyles & typeof InputStyles, typeof variantKeys>, 'error'>;

const CodeMirror = ({
  ref,
  className,
  id,
  label = '',
  loading = false,
  disabled = false,
  clearable = false,
  value = '',
  error,
  mode = 'css',
  theme = 'light',
  autoComplete = autoCompleteDefault,
  onChange,
  onBlur,
  lineWrapping = false,
  multiline = true,
  readOnly = false,
  placeholder = '',
  style,
  size,
  rounded,
  intent,
  getReadOnlyRanges,
  extensions: extraExtensions
}: CodeMirrorProps) => {
  const classNameTheme = useTheme<typeof CodeMirrorStyles & typeof InputStyles, typeof variantKeys>('CodeMirror', {
    className,
    componentKey: ['root', 'inputContainer', 'iconFloatingContainer', 'icon', 'iconError', 'iconClear', 'input'],
    variants: { size, rounded, intent }
  });
  const inputClassNameTheme = useMemo(() => omit(classNameTheme, ['input']), [classNameTheme]);
  const basicSetupMemo = useMemo(() => ({ lineNumbers: multiline, foldGutter: multiline }), [multiline]);
  const styleMemo = useMemo(() => ({ ...style, height: '100%' }), [style]);
  const { id: fieldId, labelId, describedBy } = useInputField({ id, error });
  const hasLabel = !!label;
  const invalid = !!error;
  const fieldAttributes = useMemo(() => {
    const attributes: Record<string, string> = { id: fieldId };
    if (hasLabel) {
      attributes['aria-labelledby'] = labelId;
    }

    if (describedBy) {
      attributes['aria-describedby'] = describedBy;
    }

    if (invalid) {
      attributes['aria-invalid'] = 'true';
    }

    return EditorView.contentAttributes.of(attributes);
  }, [fieldId, labelId, describedBy, hasLabel, invalid]);
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
        let block = false;
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

          if (block as boolean) {
            return [];
          }
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

  const [languageExtension, setLanguageExtension] = useState<Extension[] | undefined>(undefined);

  useEffect(() => {
    let active = true;

    async function loadLanguage() {
      if (mode === 'js') {
        const mod = await import('@codemirror/lang-javascript');
        if (!active) {
          return;
        }

        setLanguageExtension([
          mod.javascript({ jsx: true }),
          mod.javascriptLanguage.data.of({ autocomplete: autoCompleteHandler })
        ]);
      } else if (mode === 'ts') {
        const mod = await import('@codemirror/lang-javascript');
        if (!active) {
          return;
        }

        setLanguageExtension([
          mod.javascript({ typescript: true }),
          mod.typescriptLanguage.data.of({ autocomplete: autoCompleteHandler })
        ]);
      } else if (mode === 'css') {
        const mod = await import('@codemirror/lang-css');
        if (!active) {
          return;
        }

        setLanguageExtension([mod.css(), mod.cssLanguage.data.of({ autocomplete: autoCompleteHandler })]);
      } else if (mode === 'json') {
        const mod = await import('@codemirror/lang-json');
        if (!active) {
          return;
        }

        setLanguageExtension([mod.json(), mod.jsonLanguage.data.of({ autocomplete: autoCompleteHandler })]);
      } else if (mode === 'html') {
        const mod = await import('@codemirror/lang-html');
        if (!active) {
          return;
        }

        setLanguageExtension([mod.html(), mod.htmlLanguage.data.of({ autocomplete: autoCompleteHandler })]);
      } else {
        setLanguageExtension([autocompletion({ override: [autoCompleteHandler] })]);
      }
    }

    void loadLanguage();

    return () => {
      active = false;
    };
  }, [mode, autoCompleteHandler]);

  const extensions = useMemo(() => {
    const extensionsInternal = [
      fieldAttributes,
      readOnlyTransactionFilter(),
      keymap.of([{ key: 'Tab', run: acceptCompletion }]),
      keymap.of([indentWithTab])
    ];

    if (languageExtension) {
      extensionsInternal.push(...languageExtension);
    }

    if (lineWrapping) {
      extensionsInternal.push(EditorView.lineWrapping);
    }

    if (extraExtensions) {
      extensionsInternal.push(...extraExtensions);
    }

    return extensionsInternal;
  }, [fieldAttributes, readOnlyTransactionFilter, lineWrapping, languageExtension, extraExtensions]);

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
    ref: ref as RefObject<HTMLElement>
  });

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handleClickClear = useCallback(() => onChange?.(''), [onChange]);

  return (
    <InputContainer
      className={inputClassNameTheme}
      id={fieldId}
      labelledByControl
      label={label}
      error={error}
      disabled={disabled}
      intent={intent}
      size={size}
      loading={loading}
      clearable={clearable}
      value={value}
      onClear={handleClickClear}
    >
      <div className={classNameTheme.input} ref={editorRef} onKeyDown={handleKeyDown} onBlur={onBlur} />
    </InputContainer>
  );
};

export default CodeMirror;
