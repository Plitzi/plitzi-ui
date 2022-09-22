// Packages
import React from 'react';

// Relatives
import Heading from './Heading';

export default {
  component: Heading,
  title: 'Components/Heading'
};

const Template = args => <Heading {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...Heading.defaultProps
};
