// Packages
import React from 'react';

// Relatives
import Checkbox from './Checkbox';

export default {
  component: Checkbox,
  title: 'Components/Checkbox'
};

const Template = args => <Checkbox {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...Checkbox.defaultProps
};
