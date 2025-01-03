// Packages
import classNames from 'classnames';

// Alias
import Label from '@components/Label';
import useTheme from '@hooks/useTheme';

// Types
import type SwitchyStyles from './Switch.styles';
import type { variantKeys } from './Switch.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ChangeEvent, ReactNode, Ref } from 'react';

export type SwitchProps = {
  ref?: Ref<HTMLInputElement>;
  children?: ReactNode;
  value?: string;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
} & useThemeSharedProps<typeof SwitchyStyles, typeof variantKeys>;

const Switch = ({
  ref,
  children,
  className = '',
  value = '',
  checked = true,
  intent,
  size = 'md',
  onChange,
  ...inputProps
}: SwitchProps) => {
  const classNameTheme = useTheme<typeof SwitchyStyles, typeof variantKeys, false>('Switch', {
    className,
    componentKey: ['root', 'switch', 'slider'],
    variant: { intent, size }
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
        />
        <span className={classNames('slider', classNameTheme.slider)} />
      </div>
      {children}
    </Label>
  );
};

export default Switch;
