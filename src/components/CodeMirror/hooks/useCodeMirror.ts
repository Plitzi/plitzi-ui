import { EditorState, StateEffect } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, placeholder } from '@codemirror/view';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

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
  const valueUpdatingRef = useRef(false);

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
        exts.push(EditorView.theme({ '&': { backgroundColor: '#fff' } }, { dark: false }));

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

    if (typeof onChange === 'function') {
      exts.push(
        EditorView.updateListener.of(viewUpdate => {
          if (viewUpdate.docChanged && typeof onChange === 'function') {
            const newValue = viewUpdate.state.doc.toString();
            if (!valueUpdatingRef.current) {
              onChange(newValue, viewUpdate);
            } else {
              valueUpdatingRef.current = false;
            }
          }
        })
      );
    }

    return exts;
  }, [extensions, style, theme, editable, multiline, readOnly, defaultBasicSetup, placeholderString, onChange]);

  useEffect(() => {
    let viewInternal: EditorView | undefined;
    if (element && typeof value === 'string') {
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
  }, [element, myExtensions, value]);

  useEffect(() => {
    if (view) {
      view.dispatch({ effects: StateEffect.reconfigure.of(myExtensions) });
    }
  }, [myExtensions, view]);

  useEffect(() => {
    if (typeof value === 'string') {
      const currentValue = view ? view.state.doc.toString() : '';
      if (view && value !== currentValue) {
        // This one is to prevent that after value changes trigger onChange (updateListener)
        valueUpdatingRef.current = true;
        view.dispatch({
          changes: { from: 0, to: currentValue.length, insert: value || '' }
        });
      }
    }
  }, [value, view]);

  return { editorRef, view };
};

export default useCodeMirror;
