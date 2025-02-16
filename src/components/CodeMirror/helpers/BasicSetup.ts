import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  indentUnit,
  foldKeymap
} from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { EditorState } from '@codemirror/state';
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap
} from '@codemirror/view';

import type { KeyBinding } from '@codemirror/view';

export type BasicSetupOptions = {
  closeBracketsKeymap?: boolean;
  defaultKeymap?: boolean;
  searchKeymap?: boolean;
  historyKeymap?: boolean;
  foldKeymap?: boolean;
  completionKeymap?: boolean;
  lintKeymap?: boolean;
  lineNumbers?: boolean;
  highlightActiveLineGutter?: boolean;
  highlightSpecialChars?: boolean;
  history?: boolean;
  foldGutter?: boolean;
  drawSelection?: boolean;
  dropCursor?: boolean;
  allowMultipleSelections?: boolean;
  indentOnInput?: boolean;
  syntaxHighlighting?: boolean;
  bracketMatching?: boolean;
  closeBrackets?: boolean;
  autocompletion?: boolean;
  rectangularSelection?: boolean;
  crosshairCursor?: boolean;
  highlightActiveLine?: boolean;
  highlightSelectionMatches?: boolean;
  tabSize?: number;
};

export const basicSetup = (options: BasicSetupOptions = {}) => {
  let keymaps: KeyBinding[] = [];
  if (options.closeBracketsKeymap !== false) {
    keymaps = keymaps.concat(closeBracketsKeymap);
  }

  if (options.defaultKeymap !== false) {
    keymaps = keymaps.concat(defaultKeymap);
  }

  if (options.searchKeymap !== false) {
    keymaps = keymaps.concat(searchKeymap);
  }

  if (options.historyKeymap !== false) {
    keymaps = keymaps.concat(historyKeymap);
  }

  if (options.foldKeymap !== false) {
    keymaps = keymaps.concat(foldKeymap);
  }

  if (options.completionKeymap !== false) {
    keymaps = keymaps.concat(completionKeymap);
  }

  if (options.lintKeymap !== false) {
    keymaps = keymaps.concat(lintKeymap);
  }

  const extensions = [];
  if (options.lineNumbers !== false) {
    extensions.push(lineNumbers());
  }

  if (options.highlightActiveLineGutter !== false) {
    extensions.push(highlightActiveLineGutter());
  }

  if (options.highlightSpecialChars !== false) {
    extensions.push(highlightSpecialChars());
  }

  if (options.history !== false) {
    extensions.push(history());
  }

  if (options.foldGutter !== false) {
    extensions.push(foldGutter());
  }

  if (options.drawSelection !== false) {
    extensions.push(drawSelection());
  }

  if (options.dropCursor !== false) {
    extensions.push(dropCursor());
  }

  if (options.allowMultipleSelections !== false) {
    extensions.push(EditorState.allowMultipleSelections.of(true));
  }

  if (options.indentOnInput !== false) {
    extensions.push(indentOnInput());
  }

  if (options.syntaxHighlighting !== false) {
    extensions.push(syntaxHighlighting(defaultHighlightStyle, { fallback: true }));
  }

  if (options.bracketMatching !== false) {
    extensions.push(bracketMatching());
  }

  if (options.closeBrackets !== false) {
    extensions.push(closeBrackets());
  }

  if (options.autocompletion !== false) {
    extensions.push(autocompletion());
  }

  if (options.rectangularSelection !== false) {
    extensions.push(rectangularSelection());
  }

  if (options.crosshairCursor !== false) {
    extensions.push(crosshairCursor());
  }

  if (options.highlightActiveLine !== false) {
    extensions.push(highlightActiveLine());
  }

  if (options.highlightSelectionMatches !== false) {
    extensions.push(highlightSelectionMatches());
  }

  if (options.tabSize && typeof options.tabSize === 'number') {
    extensions.push(indentUnit.of(' '.repeat(options.tabSize)));
  }

  return extensions.concat([keymap.of(keymaps.flat())]).filter(Boolean);
};

export type MinimalSetupOptions = {
  defaultKeymap?: boolean;
  historyKeymap?: boolean;
  highlightSpecialChars?: boolean;
  history?: boolean;
  drawSelection?: boolean;
  syntaxHighlighting?: boolean;
};

export const minimalSetup = (options: MinimalSetupOptions = {}) => {
  let keymaps: KeyBinding[] = [];
  if (options.defaultKeymap !== false) {
    keymaps = keymaps.concat(defaultKeymap);
  }

  if (options.historyKeymap !== false) {
    keymaps = keymaps.concat(historyKeymap);
  }

  const extensions = [];
  if (options.highlightSpecialChars !== false) {
    extensions.push(highlightSpecialChars());
  }

  if (options.history !== false) {
    extensions.push(history());
  }

  if (options.drawSelection !== false) {
    extensions.push(drawSelection());
  }

  if (options.syntaxHighlighting !== false) {
    extensions.push(syntaxHighlighting(defaultHighlightStyle, { fallback: true }));
  }

  return extensions.concat([keymap.of(keymaps.flat())]).filter(Boolean);
};
