import { useState } from 'react';

import MetricInput from './MetricInput';

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
    prefix: '$',
    units: [
      { value: 'rem', label: 'Rem' },
      { value: 'px', label: 'Px' },
      { value: '%', label: '%' }
      // { value: '', label: '-' }
    ],
    allowedWords: ['auto', 'nice']
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
        <MetricInput {...args} size="md" value={value} onChange={handleChange} max={50} step={0.2} allowVariables>
          <MetricInput.Icon icon="fa-solid fa-check" />
        </MetricInput>
        <MetricInput {...args} size="sm">
          <MetricInput.Icon icon="fa-solid fa-check" />
        </MetricInput>
        <MetricInput {...args} size="xs">
          <MetricInput.Icon icon="fa-solid fa-check" />
        </MetricInput>
        <div className="flex w-75 gap-2">
          <MetricInput {...args} size="sm" className="min-w-0 grow">
            <MetricInput.Icon icon="fa-solid fa-check" />
          </MetricInput>
          <MetricInput {...args} size="sm" className="min-w-0 grow">
            <MetricInput.Icon icon="fa-solid fa-check" />
          </MetricInput>
          <MetricInput {...args} size="sm" className="min-w-0 grow">
            <MetricInput.Icon icon="fa-solid fa-check" />
          </MetricInput>
        </div>
      </div>
    );
  }
};

export const Metrics: Story = {
  args: {
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
        <MetricInput {...args} size="md" value={value} onChange={handleChange}>
          <MetricInput.Icon icon="fa-solid fa-check" />
        </MetricInput>
        <MetricInput {...args} size="sm" value={value} onChange={handleChange}>
          <MetricInput.Icon icon="fa-solid fa-check" />
        </MetricInput>
        <MetricInput {...args} size="xs" value={value} onChange={handleChange}>
          <MetricInput.Icon icon="fa-solid fa-check" />
        </MetricInput>
      </div>
    );
  }
};

export const Builder: Story = {
  args: {
    prefix: '',
    units: [
      { value: 'rem', label: 'Rem' },
      { value: 'px', label: 'Px' },
      { value: '%', label: '%' }
    ]
  },
  render: args => (
    <div className="flex flex-col gap-4 items-center justify-center">
      <MetricInput {...args} size="md" className={{ input: 'w-12.5' }} />
      <MetricInput {...args} size="sm" className={{ input: 'w-12.5' }} />
      <MetricInput {...args} size="xs" className={{ input: 'w-12.5' }} />
    </div>
  )
};
