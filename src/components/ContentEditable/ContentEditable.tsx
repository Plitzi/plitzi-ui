import { useCallback, useEffect, useMemo, useRef } from 'react';

import useTheme from '@hooks/useTheme';

import type ContentEditableStyles from './ContentEditable.styles';
import type { variantKeys } from './ContentEditable.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, KeyboardEvent } from 'react';

export type ContentEditableProps = {
  myWindow?: Window | null;
  value?: string;
  exitOnEnter?: boolean;
  exitOnEscape?: boolean;
  updateMode?: 'blur' | 'change';
  openMode?: 'click' | 'doubleClick';
  onChange?: (value: string) => void;
  onEditOpen?: () => void;
  onEditClose?: () => void;
} & useThemeSharedProps<typeof ContentEditableStyles, typeof variantKeys>;

const ContentEditable = ({
  className = 'focus-visible:px-1 focus-visible:m-[1px] focus-visible:outline-dashed focus-visible:outline-1',
  myWindow,
  value = '',
  exitOnEnter = true,
  exitOnEscape = true,
  updateMode = 'blur',
  openMode = 'click',
  size,
  onChange,
  onEditOpen,
  onEditClose
}: ContentEditableProps) => {
  className = useTheme<typeof ContentEditableStyles, typeof variantKeys>('ContentEditable', {
    className,
    componentKey: 'root',
    variants: { size }
  });

  const contentEditableRef = useRef<HTMLDivElement>(null);

  const finalWindow = useMemo(() => {
    if (myWindow) {
      return myWindow;
    }

    if (typeof window !== 'undefined') {
      return window;
    }

    return undefined;
  }, [myWindow]);

  useEffect(() => {
    if (contentEditableRef.current && contentEditableRef.current.textContent !== value) {
      contentEditableRef.current.textContent = value;
    }
  }, [value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLDivElement>) => {
      if (updateMode === 'change') {
        onChange?.((e.target as HTMLDivElement).textContent ?? '');
      }
    },
    [onChange, updateMode]
  );

  const moveCursorToEnd = useCallback(
    (elementDOM: HTMLElement) => {
      if (!finalWindow) {
        return;
      }

      const range = finalWindow.document.createRange();
      const selection = finalWindow.getSelection();
      range.setStart(elementDOM, elementDOM.childNodes.length);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    },
    [finalWindow]
  );

  const handleClick = useCallback(() => {
    const elementDOM = contentEditableRef.current;
    if (!elementDOM) {
      return;
    }

    if (elementDOM.contentEditable === 'inherit' || elementDOM.contentEditable === 'false') {
      moveCursorToEnd(elementDOM);
    }

    if (openMode === 'click') {
      elementDOM.setAttribute('contenteditable', 'true');
      elementDOM.focus();
      onEditOpen?.();
    }
  }, [openMode, moveCursorToEnd, onEditOpen]);

  const handleDoubleClick = useCallback(() => {
    const elementDOM = contentEditableRef.current;
    if (!elementDOM) {
      return;
    }

    if (openMode === 'doubleClick') {
      elementDOM.setAttribute('contenteditable', 'true');
      elementDOM.focus();
      onEditOpen?.();
    }
  }, [openMode, onEditOpen]);

  const handleBlur = useCallback(() => {
    const elementDOM = contentEditableRef.current;
    if (!elementDOM) {
      return;
    }

    elementDOM.setAttribute('contenteditable', 'false');
    if (updateMode === 'blur') {
      if (elementDOM.textContent !== value) {
        onChange?.(elementDOM.textContent ?? '');
      }
    }

    onEditClose?.();
  }, [onChange, updateMode, value, onEditClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.stopPropagation();
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      if (exitOnEnter && e.keyCode === 13) {
        e.preventDefault();
        (e.target as HTMLElement).blur();
        // eslint-disable-next-line @typescript-eslint/no-deprecated
      } else if (exitOnEscape && e.keyCode === 27) {
        e.preventDefault();
        (e.target as HTMLElement).textContent = value;
        (e.target as HTMLElement).blur();
      }
    },
    [exitOnEnter, exitOnEscape, value]
  );

  return (
    <div
      className={className}
      ref={contentEditableRef}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onInput={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default ContentEditable;
