import { fn } from '@storybook/test';
import { useCallback } from 'react';
import { useArgs } from 'storybook/preview-api';

import FileUpload from './FileUpload';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'FileUpload',
  component: FileUpload,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Select a resource file to upload',
    types: ['jpeg', 'jpg', 'png', 'json', 'zip'],
    maxSize: 10240000,
    // error: 'Test',
    // disabled: true,
    onDraggingStateChange: fn()
  },
  render: function Render(args) {
    const [{ value, error }, updateArgs] = useArgs<typeof args>();

    const handleChange = useCallback(
      (data?: File | File[]) => {
        console.log('files to upload', data);
        updateArgs({ value: data as File[] });
      },
      [updateArgs]
    );

    const handleError = useCallback((data?: string) => updateArgs({ error: data }), [updateArgs]);

    return (
      <div className="p-10 flex flex-col w-full gap-10">
        <FileUpload
          {...(args as Omit<typeof args, 'onDrop'>)}
          multiple
          value={value as File[]}
          error={error}
          onChange={handleChange}
          onError={handleError}
        />
        <FileUpload
          {...(args as Omit<typeof args, 'onDrop'>)}
          multiple={false}
          value={value as File}
          error={error}
          onChange={handleChange}
          onError={handleError}
          size="sm"
        />
        <FileUpload
          {...(args as Omit<typeof args, 'onDrop'>)}
          multiple={false}
          value={value as File}
          error={error}
          onChange={handleChange}
          onError={handleError}
          size="xs"
        />
        <FileUpload
          {...(args as Omit<typeof args, 'onDrop'>)}
          multiple
          value={value as File[]}
          error={error}
          onChange={handleChange}
          onError={handleError}
          canDragAndDrop
        />
        <FileUpload
          {...(args as Omit<typeof args, 'onDrop'>)}
          multiple={false}
          value={value as File}
          error={error}
          onChange={handleChange}
          onError={handleError}
          size="sm"
          canDragAndDrop
        />
        <FileUpload
          {...(args as Omit<typeof args, 'onDrop'>)}
          multiple={false}
          value={value as File}
          error={error}
          onChange={handleChange}
          onError={handleError}
          size="xs"
          canDragAndDrop
        />
      </div>
    );
  }
};
