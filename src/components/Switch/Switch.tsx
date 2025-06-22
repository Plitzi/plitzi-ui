import classNames from 'classnames';

import Label from '@components/Label';
import useTheme from '@hooks/useTheme';

import type SwitchyStyles from './Switch.styles';
import type { variantKeys } from './Switch.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, ReactNode, RefObject } from 'react';

export type SwitchProps = {
  ref?: RefObject<HTMLInputElement>;
  children?: ReactNode;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
} & useThemeSharedProps<typeof SwitchyStyles, typeof variantKeys>;

const Switch = ({
  ref,
  children,
  className = '',
  value = '',
  checked = true,
  disabled = false,
  intent,
  size = 'md',
  onChange,
  ...inputProps
}: SwitchProps) => {
  const classNameTheme = useTheme<typeof SwitchyStyles, typeof variantKeys>('Switch', {
    className,
    componentKey: ['root', 'switch', 'slider'],
    variants: { intent, size }
  });

  return (
    <Label className={classNameTheme.root}>
      <div className={classNames('switch', classNameTheme.switch)}>
        <input
          {...inputProps}
          type="checkbox"
          ref={ref}
          value={value}
          checked={checked}
          readOnly={!onChange || inputProps.readOnly}
          onChange={onChange}
          className="opacity-0 w-0 h-0 peer"
          disabled={disabled}
        />
        <span className={classNames('slider', classNameTheme.slider)} />
      </div>
      {children}
    </Label>
  );
};

export default Switch;
