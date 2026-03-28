import { useCallback, useMemo } from 'react';
import { useArgs } from 'storybook/preview-api';

import Icon from '@components/Icon';

import Select2 from './Select2';

import type { Option, OptionGroup } from './Select2';
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
      {
        value: 'hello',
        label: 'Hello a b c d e f wwwww',
        customParam: 'Nice',
        icon: <Icon icon="fa-solid fa-house" />
      },
      { value: 'world', label: 'World', icon: <Icon icon="fa-solid fa-circle-user" /> },
      {
        label: 'Group 1',
        icon: <Icon icon="fa-solid fa-image" />,
        options: [
          { value: 'hello1', label: 'Hello 1' },
          { value: 'world', label: 'World' }
        ]
      },
      {
        label: 'Group 2',
        options: [
          { value: 'hello2', label: 'Hello 2' },
          { value: 'world', label: 'World' },
          { value: 'world', label: 'World' },
          { value: 'world', label: 'World' },
          { value: 'world', label: 'World' },
          { value: 'world', label: 'World' },
          { value: 'world', label: 'World' },
          { value: 'world', label: 'World' }
        ]
      }
    ]
  },
  render: function Render(args) {
    // const { options } = args;
    const [{ value, options }, updateArgs] = useArgs<typeof args>();

    const handleRemove = useCallback(
      (option: Exclude<Option, OptionGroup>) => {
        console.log(option);
        updateArgs({ options: (options as Option[]).filter(op => !('value' in op) || op.value !== option.value) });
      },
      [options, updateArgs]
    );

    return (
      <div className="flex flex-col gap-4 w-96 h-96">
        <Select2
          {...args}
          valueAsString={false}
          value={value}
          options={options}
          allowRemoveOptions
          onChange={option => updateArgs({ value: option })}
          onRemove={handleRemove}
        />
        <Select2
          {...args}
          valueAsString={false}
          allowRemoveOptions
          size="sm"
          value={value}
          options={options}
          error="This is an error"
          clearable
          className="w-112.5"
          onChange={option => updateArgs({ value: option })}
          onRemove={handleRemove}
        />
        <Select2
          {...args}
          valueAsString={false}
          allowRemoveOptions
          size="xs"
          value={value}
          options={options}
          className={{ trigger: 'w-75' }}
          onChange={option => updateArgs({ value: option })}
          onRemove={handleRemove}
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
    const [{ value, options }, updateArgs] = useArgs<typeof args>();

    const handleRemove = useCallback(
      (option: Exclude<Option, OptionGroup>) => {
        console.log(option);
        updateArgs({ options: (options as Option[]).filter(op => !('value' in op) || op.value !== option.value) });
      },
      [options, updateArgs]
    );

    const optionsMemo = useMemo(() => {
      return new Promise<Option[]>(resolve => {
        setTimeout(() => {
          resolve(options as Option[]);
        }, 1000);
      });
    }, [options]);

    return (
      <div>
        <Select2
          {...args}
          valueAsString={false}
          allowRemoveOptions
          value={value}
          options={optionsMemo}
          onChange={option => updateArgs({ value: option })}
          onRemove={handleRemove}
        />
      </div>
    );
  }
};
