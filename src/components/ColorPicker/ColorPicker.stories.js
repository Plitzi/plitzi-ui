// Packages
import React from 'react';

// Relatives
import ColorPicker from './ColorPicker';

export default {
  component: ColorPicker,
  title: 'Components/ColorPicker'
};

const onChange = value => {
  console.log(value);
};

const Template = args => <ColorPicker {...args} onChange={onChange} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...ColorPicker.defaultProps
};
