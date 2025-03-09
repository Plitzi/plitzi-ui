import { useCallback } from 'react';

import Button from '@components/Button';
import Flex from '@components/Flex';
import useDisclosure from '@hooks/useDisclosure';

import Modal from './Modal';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Modal',
  component: Modal,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const handleClose = useCallback(() => {
      console.log('closing...');
    }, []);

    const [id, open, onOpen, onClose] = useDisclosure({ onClose: handleClose });

    return (
      <Flex>
        <Button onClick={onOpen}>Click Me</Button>
        <Modal {...args} onClose={onClose} id={id} open={open}>
          <Modal.Header>
            <Modal.HeaderIcon icon="fa-solid fa-triangle-exclamation"></Modal.HeaderIcon>
            Title
          </Modal.Header>
          <Modal.Body>Fancy Content Here</Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Flex>
    );
  }
};

export const Dialog: Story = {
  args: {},
  render: function Render(args) {
    const handleClose = useCallback((value?: unknown) => {
      console.log('closing...', value);
    }, []);

    const [id, open, onOpen, onClose] = useDisclosure<{ test: string }>({ onClose: handleClose });

    return (
      <Flex>
        <Button onClick={onOpen}>Click Me</Button>
        <Modal {...args} onClose={onClose} id={id} open={open}>
          <Modal.Header>
            <Modal.HeaderIcon icon="fa-solid fa-triangle-exclamation"></Modal.HeaderIcon>
            Title
          </Modal.Header>
          <Modal.Body>Fancy Content Here</Modal.Body>
          <Modal.Footer>
            <Button onClick={() => onClose({ test: 'abc' })}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Flex>
    );
  }
};
