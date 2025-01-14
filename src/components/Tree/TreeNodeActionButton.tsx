// Packages
import classNames from 'classnames';

// Types
import type { ButtonHTMLAttributes } from 'react';

export type TreeNodeActionButtonProps = {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  theme?: 'normal' | 'default';
  isRemoving?: boolean;
  isVisible?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const TreeNodeActionButton = ({
  className = '',
  children,
  title = 'Title',
  theme = 'normal',
  isRemoving = false,
  isVisible = true,
  ...otherProps
}: TreeNodeActionButtonProps) => {
  return (
    <button
      type="button"
      className={classNames(
        'px-1 items-center justify-center cursor-pointer',
        {
          flex: isVisible,
          hidden: !isVisible,
          'text-blue-400 hover:text-blue-300': theme === 'normal' && !isRemoving,
          'text-red-400 hover:text-red-300': isRemoving
        },
        className
      )}
      title={title}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default TreeNodeActionButton;
