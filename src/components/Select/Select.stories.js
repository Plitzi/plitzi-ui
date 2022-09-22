// Packages
import React from 'react';

// Relatives
import Select from './Select';

export default {
  component: Select,
  title: 'Components/Select'
};

const Template = args => <Select {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  children: [<option value="hello">Hello</option>, <option value="world">World</option>]
};
