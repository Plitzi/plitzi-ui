import { Annotation, EditorState, StateEffect } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, placeholder } from '@codemirror/view';
import { useState, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { basicSetup } from '../helpers/BasicSetup';

import type { BasicSetupOptions } from '../helpers/BasicSetup';
import type { Extension } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';
import type { RefObject } from 'react';

export type StyleSpec = {
  [propOrSelector: string]: string | number | StyleSpec | null;
};

export type UseCodeMirrorProps = {
  extensions: Extension[];
  theme: 'light' | 'dark' | 'none';
  ref?: RefObject<HTMLElement>;
  editable?: boolean;
  multiline?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  style?: StyleSpec;
  basicSetup?: BasicSetupOptions | boolean;
  value?: string;
  onChange?: (value: string, viewUpdate?: ViewUpdate) => void;
};

/**
 * Marks the transaction that writes a new `value` into the editor: a change that came from outside, which `onChange` is
 * not told of — telling it would hand the caller its own value back, and, with the value changed under it (another file
 * opened in the same editor), hand it to the callback that belonged to the value before.
 */
const external = Annotation.define<boolean>();

const useCodeMirror = ({
  extensions = [],
  theme = 'light',
  style = undefined,
  editable = true,
  multiline = true,
  readOnly = false,
  basicSetup: defaultBasicSetup = true,
  placeholder: placeholderString = '',
  value = '',
  ref,
  onChange
}: UseCodeMirrorProps) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [view, setView] = useState<EditorView | undefined>(undefined);
  // The caller's latest `onChange`, read when the document changes: the listener the editor was built with is not
  // rebuilt for every new callback, so it must never call one that belonged to an earlier render.
  const onChangeRef = useRef(onChange);
  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editorRef = useCallback(
    (node?: HTMLDivElement | null) => {
      if (!node) {
        return;
      }

      if (ref && typeof ref === 'object') {
        ref.current = node;
      }

      setElement(node);
    },
    [ref]
  );

  const myExtensions = useMemo(() => {
    const exts = [...extensions, EditorView.theme({ '&': style ?? {} })];
    switch (theme) {
      case 'light':
        exts.push(EditorView.theme({ '&': { backgroundColor: '#fff', color: 'inherit' } }, { dark: false }));

        break;
      case 'dark':
        exts.push(oneDark);

        break;
      case 'none':
        break;
      default:
        exts.push(theme);
    }

    if (!editable) {
      exts.push(EditorView.editable.of(false));
    }

    if (!multiline) {
      exts.push(EditorState.transactionFilter.of(tr => (tr.newDoc.lines > 1 ? [] : tr)));
    } else {
      // Code, rather than a field with tokens in it: set in a monospaced face (`Assets/index.scss`).
      exts.push(EditorView.editorAttributes.of({ class: 'cm-multiline' }));
    }

    if (readOnly) {
      exts.push(EditorState.readOnly.of(true));
    }

    if (defaultBasicSetup) {
      if (typeof defaultBasicSetup === 'boolean') {
        exts.unshift(basicSetup());
      } else {
        exts.unshift(basicSetup(defaultBasicSetup));
      }
    }

    if (placeholderString) {
      exts.unshift(placeholder(placeholderString));
    }

    exts.push(
      EditorView.updateListener.of(viewUpdate => {
        const fromOutside = viewUpdate.transactions.some(transaction => transaction.annotation(external));
        if (viewUpdate.docChanged && !fromOutside) {
          onChangeRef.current?.(viewUpdate.state.doc.toString(), viewUpdate);
        }
      })
    );

    return exts;
  }, [extensions, style, theme, editable, multiline, readOnly, defaultBasicSetup, placeholderString]);

  useEffect(() => {
    let viewInternal: EditorView | undefined;
    if (element && typeof value === 'string') {
      // EditorView can be created only 1 time
      viewInternal = new EditorView({
        state: EditorState.create({ doc: value, extensions: myExtensions }),
        parent: element
      });

      setView(viewInternal);
    }

    return () => {
      if (viewInternal) {
        viewInternal.destroy();
        setView(undefined);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  useEffect(() => {
    if (view) {
      view.dispatch({ effects: StateEffect.reconfigure.of(myExtensions) });
    }
  }, [myExtensions, view]);

  // A new value from the caller, written in as a change from outside: `onChange` is not told of it.
  useEffect(() => {
    const current = view ? view.state.doc.toString() : '';
    if (view && value !== current) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value }, annotations: external.of(true) });
    }
  }, [value, view]);

  return { editorRef, view };
};

export default useCodeMirror;
