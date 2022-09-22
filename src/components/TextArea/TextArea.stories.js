// Packages
import React from 'react';

// Relatives
import TextArea from './TextArea';

export default {
  component: TextArea,
  title: 'Components/TextArea'
};

const Template = args => <TextArea {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...TextArea.defaultProps
};
