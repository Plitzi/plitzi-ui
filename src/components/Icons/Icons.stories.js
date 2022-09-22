// Packages
import React from 'react';

// Relatives
import Icons from './Icons';

export default {
  component: Icons,
  title: 'Components/Icons'
};

const Template = args => <Icons {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...Icons.defaultProps,
  iconType: 'logo'
};
