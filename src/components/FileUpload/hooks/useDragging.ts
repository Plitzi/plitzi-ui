import { useState, useEffect, useCallback } from 'react';

import type { RefObject } from 'react';

let draggingCount = 0;

export type UseDraggingProps = {
  labelRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (files: File | File[]) => boolean;
  onDrop?: (files: File | File[]) => void;
};

export default function useDragging({
  labelRef,
  inputRef,
  multiple = false,
  onChange,
  onDrop,
  disabled = false
}: UseDraggingProps) {
  const [dragging, setDragging] = useState(false);

  const handleClick = useCallback(() => !disabled && inputRef.current?.click(), [disabled, inputRef]);

  const handleDragIn = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount++;
    if (ev.dataTransfer?.items && ev.dataTransfer.items.length !== 0) {
      setDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount--;
    if (draggingCount > 0) {
      return;
    }

    setDragging(false);
  }, []);

  const handleDrag = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (ev: DragEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      setDragging(false);
      draggingCount = 0;

      const eventFiles = ev.dataTransfer?.files;
      if (eventFiles && eventFiles.length > 0) {
        const files = multiple ? Array.from(eventFiles) : eventFiles[0];
        const success = onChange?.(files);
        if (onDrop && success) {
          onDrop(files);
        }
      }
    },
    [onChange, multiple, onDrop]
  );

  useEffect(() => {
    const ele = labelRef.current;
    if (!disabled && ele) {
      ele.addEventListener('click', handleClick);
      ele.addEventListener('dragenter', handleDragIn);
      ele.addEventListener('dragleave', handleDragOut);
      ele.addEventListener('dragover', handleDrag);
      ele.addEventListener('drop', handleDrop);
    }

    return () => {
      if (!disabled && ele) {
        ele.removeEventListener('click', handleClick);
        ele.removeEventListener('dragenter', handleDragIn);
        ele.removeEventListener('dragleave', handleDragOut);
        ele.removeEventListener('dragover', handleDrag);
        ele.removeEventListener('drop', handleDrop);
      }
    };
  }, [handleClick, handleDragIn, handleDragOut, handleDrag, handleDrop, labelRef, disabled]);

  return dragging;
}
