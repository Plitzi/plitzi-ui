import { useCallback } from 'react';
import { useArgs } from 'storybook/preview-api';

import KVInput from './KVInput';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'KVInput',
  component: KVInput,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md'],
      description: 'Size of the input',
      table: {
        type: { summary: 'xs | sm | md' },
        defaultValue: { summary: 'md' }
      }
    }
  },
  args: {}
} satisfies Meta<typeof KVInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Key-Value Input',
    // error: 'This is an error',
    // allowAppend: false,
    // allowRemove: false,
    // allowKeyEdit: false,
    allowDuplicateKeys: true,
    // disabled: false,
    required: false,
    clearable: true,
    keysAllowed: [
      { value: 'key1', label: 'Key 1' },
      { value: 'key2' },
      { value: 'key3' },
      { value: 'key4.subKey1', label: 'Key 4 - Sub Key 1' },
      { value: 'key4.subKey2', label: 'Key 4 - Sub Key 2' }
    ],
    value: [
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key4.subKey1', 'test'],
      ['key4', 'subKey2', '123']
    ]
    // value: {
    //   key1: 'value1',
    //   key2: 'value2',
    //   key4: {
    //     subKey1: 'test',
    //     subKey2: '123'
    //   }
    // }
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    const handleChange = useCallback(
      (value: [string, string][], valueObj: object) => {
        console.log(value, valueObj);
        updateArgs({ value });
      },
      [updateArgs]
    );

    return (
      <div className="flex flex-col gap-4">
        <KVInput {...args} size="md" value={value} onChange={handleChange} />
        <KVInput {...args} size="sm" value={value} onChange={handleChange} />
        <KVInput {...args} size="xs" value={value} onChange={handleChange} />
      </div>
    );
  }
};

export const CustomStyle: Story = {
  args: {
    label: 'Key-Value Input',
    size: 'xs'
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    const handleChange = useCallback((value: [string, string][]) => updateArgs({ value }), [updateArgs]);

    return (
      <KVInput
        {...args}
        value={value}
        className={{ input: 'bg-red-300', inputContainer: 'px-0 py-0', item: 'w-full bg-blue-500' }}
        onChange={handleChange}
      />
    );
  }
};
