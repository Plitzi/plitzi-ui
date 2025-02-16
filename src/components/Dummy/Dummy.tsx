import useTheme from '@hooks/useTheme';

import type DummyStyles from './Dummy.styles';
import type { variantKeys } from './Dummy.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';

export type DummyProps = { content?: string } & useThemeSharedProps<typeof DummyStyles, typeof variantKeys>;

const Dummy = ({ className, content, intent = 'default', size }: DummyProps) => {
  className = useTheme<typeof DummyStyles, typeof variantKeys>('Dummy', {
    className,
    componentKey: 'root',
    variant: { intent, size }
  });

  return <div className={className}>Dummy Component {content}</div>;
};

export default Dummy;
