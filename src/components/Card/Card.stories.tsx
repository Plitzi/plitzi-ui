import { useCallback } from 'react';

import Button from '@components/Button';

import Card from './Card';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => <Card {...args}></Card>
};

export const Modal: Story = {
  args: {},
  render: function Render(args) {
    const handleClose = useCallback(() => {
      console.log('closing...');
    }, []);

    return (
      <Card {...args} intent="modal">
        <Card.Header closeable onClose={handleClose}>
          <Card.HeaderIcon icon="fa-solid fa-triangle-exclamation"></Card.HeaderIcon>
          Title
        </Card.Header>
        <Card.Body>Fancy Content Here</Card.Body>
        <Card.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Card.Footer>
      </Card>
    );
  }
};
