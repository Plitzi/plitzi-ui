import type { IconProps } from './Icon';

const getIntent = (
  disabled: boolean,
  active: boolean,
  intent: IconProps['intent'] = 'primary'
): IconProps['intent'] => {
  if (disabled) {
    return 'disabled';
  }

  if (active && intent === 'primary') {
    return 'primaryActive';
  }

  if (active && intent === 'secondary') {
    return 'secondaryActive';
  }

  if (active && intent === 'tertiary') {
    return 'tertiaryActive';
  }

  return intent;
};

export { getIntent };
