import { useState, useEffect, useCallback } from 'react';

let draggingCount = 0;

export default function useDragging({ labelRef, inputRef, multiple, handleChange, onDrop, disabled = false }) {
  const [dragging, setDragging] = useState(false);

  const handleClick = useCallback(() => !disabled && inputRef.current.click(), [inputRef]);

  const handleDragIn = useCallback(ev => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount++;
    if (ev.dataTransfer.items && ev.dataTransfer.items.length !== 0) {
      setDragging(true);
    }
  }, []);

  const handleDragOut = useCallback(ev => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount--;
    if (draggingCount > 0) {
      return;
    }

    setDragging(false);
  }, []);

  const handleDrag = useCallback(ev => {
    ev.preventDefault();
    ev.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    ev => {
      ev.preventDefault();
      ev.stopPropagation();
      setDragging(false);
      draggingCount = 0;

      const eventFiles = ev.dataTransfer.files;
      if (eventFiles && eventFiles.length > 0) {
        const files = multiple ? eventFiles : eventFiles[0];
        const success = handleChange(files);
        if (onDrop && success) {
          onDrop(files);
        }
      }
    },
    [handleChange]
  );

  useEffect(() => {
    const ele = labelRef.current;
    if (!disabled) {
      ele.addEventListener('click', handleClick);
      ele.addEventListener('dragenter', handleDragIn);
      ele.addEventListener('dragleave', handleDragOut);
      ele.addEventListener('dragover', handleDrag);
      ele.addEventListener('drop', handleDrop);
    }

    return () => {
      if (!disabled) {
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
