// Packages
import { useState } from 'react';

// Relatives
import MetricInput from './MetricInput';

// Types
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'MetricInput',
  component: MetricInput,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof MetricInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: 'fa-solid fa-check',
    hasError: true,
    prefix: '$'
  },
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('');

    const handleChange = (value: string) => {
      console.log(value);
      setValue(value);
    };

    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        <MetricInput {...args} size="base" value={value} onChange={handleChange} />
        <MetricInput {...args} size="sm" />
        <MetricInput {...args} size="xs" />
      </div>
    );
  }
};

export const Metrics: Story = {
  args: {
    icon: 'fa-solid fa-check',
    hasError: true,
    prefix: '$',
    units: [
      { value: 'rem', label: 'Rem' },
      { value: 'px', label: 'Px' },
      { value: '%', label: '%' }
    ]
  },
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('');

    const handleChange = (value: string) => {
      console.log(value);
      setValue(value);
    };

    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        <MetricInput {...args} size="base" value={value} onChange={handleChange} />
        <MetricInput {...args} size="sm" />
        <MetricInput {...args} size="xs" />
      </div>
    );
  }
};

export const Builder: Story = {
  args: {
    icon: '',
    hasError: false,
    prefix: '',
    units: [
      { value: 'rem', label: 'Rem' },
      { value: 'px', label: 'Px' },
      { value: '%', label: '%' }
    ]
  },
  render: args => (
    <div className="flex flex-col gap-4 items-center justify-center">
      <MetricInput {...args} size="base" className={{ input: 'w-[50px]' }} />
      <MetricInput {...args} size="sm" className={{ input: 'w-[50px]' }} />
      <MetricInput {...args} size="xs" className={{ input: 'w-[50px]' }} />
    </div>
  )
};
