// Relatives
import Popup from './Popup';
import PopupProvider from './PopupProvider';

// Types
import type { ResizeHandle } from '@components/ContainerResizable';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Popup',
  component: Popup,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Popup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: () => {
    const popups = {
      left: [
        {
          id: 'popup-1',
          component: <div>Hello World</div>,
          settings: {
            icon: <i className="fa-solid fa-sliders text-base" />,
            title: 'Popup 1',
            allowLeftSide: true,
            allowRightSide: true,
            resizeHandles: ['se'] as ResizeHandle[]
          }
        }
      ],
      right: [
        {
          id: 'popup-2',
          component: <div>Hello World</div>,
          settings: {
            icon: <i className="fa-solid fa-sliders text-base" />,
            title: 'Popup 2',
            allowLeftSide: true,
            allowRightSide: true,
            resizeHandles: ['se'] as ResizeHandle[]
          }
        }
      ],
      floating: [
        {
          id: 'popup-3',
          component: <div>Hello World</div>,
          settings: {
            icon: <i className="fa-solid fa-sliders text-base" />,
            title: 'Popup 3',
            allowLeftSide: true,
            allowRightSide: true,
            resizeHandles: ['se'] as ResizeHandle[]
          }
        }
      ]
    };

    return (
      <div className="flex">
        <PopupProvider popups={popups}>
          <div className="flex grow h-[500px] bg-gray-300"></div>
        </PopupProvider>
      </div>
    );
    // return <Popup {...args} />;
  }
};