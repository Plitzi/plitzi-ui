import { useArgs } from '@storybook/preview-api';
import { useMemo } from 'react';

// Relatives
import Select2 from './Select2';

import type { Option } from './Select2';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Select2',
  component: Select2,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Select2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
  args: {
    allowCreateOptions: true,
    // options: [
    //   { value: 'hello', label: 'Hello' },
    //   { value: 'world', label: 'World' }
    // ],
    options: [
      { value: 'hello', label: 'Hello a b c d e f wwwww', customParam: 'Nice' },
      { value: 'world', label: 'World' },
      {
        label: 'Group 1',
        options: [
          { value: 'hello1', label: 'Hello 1' },
          { value: 'world', label: 'World' }
        ]
      },
      {
        label: 'Group 2',
        options: [
          { value: 'hello2', label: 'Hello 2' },
          { value: 'world', label: 'World' }
        ]
      }
    ]
  },
  render: function Render(args) {
    const { options } = args;
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <div className="flex flex-col gap-4 w-96 h-96">
        <Select2 {...args} value={value} options={options} onChange={option => updateArgs({ value: option })} />
        <Select2
          {...args}
          size="sm"
          value={value}
          options={options}
          onChange={option => updateArgs({ value: option })}
          error="This is an error"
          clearable
        />
        <Select2
          {...args}
          size="xs"
          value={value}
          options={options}
          onChange={option => updateArgs({ value: option })}
        />
      </div>
    );
  }
};

export const AsyncUsage: Story = {
  args: {
    // options: [
    //   { value: 'hello', label: 'Hello' },
    //   { value: 'world', label: 'World' }
    // ],
    options: [
      { value: 'hello', label: 'Hello a b c d e f wwwww', customParam: 'Nice' },
      { value: 'world', label: 'World' },
      {
        label: 'Group 1',
        options: [
          { value: 'hello', label: 'Hello' },
          { value: 'world', label: 'World' }
        ]
      },
      {
        label: 'Group 2',
        options: [
          { value: 'hello', label: 'Hello' },
          { value: 'world', label: 'World' }
        ]
      }
    ]
  },
  render: function Render(args) {
    const { options } = args;
    const [{ value }, updateArgs] = useArgs<typeof args>();

    const optionsMemo = useMemo(() => {
      return new Promise<Option[]>(resolve => {
        setTimeout(() => {
          resolve(options as Option[]);
        }, 2000);
      });
    }, [options]);

    return (
      <div>
        <Select2 {...args} value={value} options={optionsMemo} onChange={option => updateArgs({ value: option })} />
      </div>
    );
  }
};
