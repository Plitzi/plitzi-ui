// Packages
import React from 'react';

// Relatives
import Card from './Card';

export default {
  component: Card,
  title: 'Components/Card'
};

const Template = args => <Card {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...Card.defaultProps
};
