// Packages
import React from 'react';

// Relatives
import Dropdown from './Dropdown';

export default {
  component: Dropdown,
  title: 'Components/Dropdown'
};

const Template = args => <Dropdown {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...Dropdown.defaultProps
};
