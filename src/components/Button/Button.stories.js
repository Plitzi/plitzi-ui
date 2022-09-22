// Packages
import React from 'react';

// Relatives
import Button from './Button';

export default {
  component: Button,
  title: 'Components/Button'
};

const Template = args => <Button {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...Button.defaultProps,
  children: 'Click me'
};
