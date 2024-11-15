// Alias
import useTheme from '@hooks/useTheme';

// Types
import type { useThemeSharedProps } from '@hooks/useTheme';
import type DummyStyles from './Dummy.styles';
import type { variantKeys } from './Dummy.styles';

export type DummyProps = { content?: string } & useThemeSharedProps<typeof variantKeys>;

const Dummy = ({ className, content, intent, size }: DummyProps) => {
  className = useTheme<typeof DummyStyles, typeof variantKeys>({
    className,
    componentKey: 'Dummy.root',
    variant: { intent, size }
  });

  return <div>Dummy Component {content}</div>;
};

export default Dummy;
