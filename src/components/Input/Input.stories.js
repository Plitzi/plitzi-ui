// Packages
import React from 'react';
import Input from './Input';

export default {
  component: Input,
  title: 'Components/Input'
};

const Template = args => <Input {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...Input.defaultProps
};
