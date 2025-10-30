import { useCallback } from 'react';

import Button from '@components/Button';
import Flex from '@components/Flex';
import useDisclosure from '@hooks/useDisclosure';

import Modal from './Modal';
import ModalProvider from './ModalProvider';
import useModal from './useModal';

import type { ModalProps } from './Modal';
import type { Meta, StoryObj } from '@storybook/react';
import type { MouseEvent } from 'react';

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
            <Button onClick={() => void onClose()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Flex>
    );
  }
};

export const PrimaryAnimated: Story = {
  args: { animation: 'zoom', duration: 300 },
  render: function Render(args) {
    const handleClose = useCallback(() => {
      console.log('closing...');
    }, []);

    const [id, open, onOpen, onClose, , , { delay, isClosing }] = useDisclosure({
      onClose: handleClose,
      delay: args.duration
    });

    return (
      <Flex>
        <Button onClick={onOpen}>Click Me</Button>
        <Modal {...args} onClose={onClose} id={id} open={open} duration={delay} isClosing={isClosing}>
          <Modal.Header>
            <Modal.HeaderIcon icon="fa-solid fa-triangle-exclamation"></Modal.HeaderIcon>
            Title
          </Modal.Header>
          <Modal.Body>Fancy Content Here</Modal.Body>
          <Modal.Footer>
            <Button onClick={() => void onClose()}>Close</Button>
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

      // return false; // if we need to keep the modal open
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
            <Button onClick={(e: MouseEvent) => void onClose(e, { test: 'abc' })}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Flex>
    );
  }
};

export const DialogAnimated: Story = {
  args: { animation: 'zoom', duration: 300 },
  render: function Render(args) {
    const handleClose = useCallback((value?: unknown) => {
      console.log('closing...', value);

      // return false; // if we need to keep the modal open
    }, []);

    const [id, open, onOpen, onClose, , , { delay, isClosing }] = useDisclosure<{ test: string }>({
      onClose: handleClose,
      delay: args.duration
    });

    return (
      <Flex>
        <Button onClick={onOpen}>Click Me</Button>
        <Modal {...args} onClose={onClose} id={id} open={open} duration={delay} isClosing={isClosing}>
          <Modal.Header>
            <Modal.HeaderIcon icon="fa-solid fa-triangle-exclamation"></Modal.HeaderIcon>
            Title
          </Modal.Header>
          <Modal.Body>Fancy Content Here</Modal.Body>
          <Modal.Footer>
            <Button onClick={(e: MouseEvent) => void onClose(e, { test: 'abc' })}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Flex>
    );
  }
};

const InnerComponent = ({ settings }: { settings: ModalProps }) => {
  const { showModal, showDialog } = useModal();

  const handleClick = useCallback(
    async (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const response = await showModal<string>(
        <Modal.Header>
          <h4>Update Page Folder</h4>
        </Modal.Header>,
        ({ onSubmit, onClose }) => (
          <Modal.Body>
            <div className="flex gap-2">
              <Button onClick={() => onSubmit('nice')}>Yes</Button>
              <Button onClick={onClose}>No</Button>
            </div>
          </Modal.Body>
        ),
        undefined,
        settings
      );

      if (response) {
        console.log(response);
      }
    },
    [showModal, settings]
  );

  const handleClickDialog = useCallback(
    async (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const response = await showDialog<string>(
        <Modal.Header>
          <h4>Update Page Folder</h4>
        </Modal.Header>,
        <Modal.Body>
          <div className="flex gap-2">i am a modal</div>
        </Modal.Body>,
        undefined,
        settings,
        'nice'
      );

      if (response) {
        console.log(response);
      }
    },
    [showDialog, settings]
  );

  return (
    <div className="flex gap-4">
      <Button onClick={(e: MouseEvent) => void handleClick(e)}>Click Me</Button>
      <Button onClick={(e: MouseEvent) => void handleClickDialog(e)}>Click Me Dialog</Button>
    </div>
  );
};

export const UsingProvider: Story = {
  args: {},
  render: function Render(args) {
    return (
      <div>
        <ModalProvider>
          <InnerComponent settings={args} />
        </ModalProvider>
      </div>
    );
  }
};

export const UsingProviderAnimated: Story = {
  args: { animation: 'zoom', duration: 300 },
  render: function Render(args) {
    return (
      <div>
        <ModalProvider>
          <InnerComponent settings={args} />
        </ModalProvider>
      </div>
    );
  }
};
