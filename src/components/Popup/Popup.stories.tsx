// Relatives
import Popup from './Popup';
import PopupProvider from './PopupProvider';

// Types
import type { Popups } from './PopupProvider';
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
          component: <div className="h-[600px] bg-red-300">Hello World 1</div>,
          settings: {
            icon: <i className="fa-solid fa-sliders text-base" />,
            title: 'Popup 1',
            allowLeftSide: true,
            allowRightSide: true,
            resizeHandles: ['se'] as ResizeHandle[]
          }
        },
        {
          id: 'popup-4',
          component: <div>Hello World 4</div>,
          settings: {
            icon: <i className="fa-solid fa-plus" />,
            title: 'Popup 4',
            allowLeftSide: true,
            allowRightSide: true,
            resizeHandles: ['se'] as ResizeHandle[]
          }
        }
      ],
      right: [
        {
          id: 'popup-2',
          component: <div>Hello World 2</div>,
          settings: {
            icon: <i className="fas fa-file" />,
            title: 'Popup 2',
            allowLeftSide: true,
            allowRightSide: true,
            resizeHandles: ['se'] as ResizeHandle[]
          }
        },
        {
          id: 'popup-5',
          component: <div>Hello World 5</div>,
          settings: {
            icon: <i className="fa-solid fa-image" />,
            title: 'Popup 5',
            allowLeftSide: true,
            allowRightSide: true,
            resizeHandles: ['se'] as ResizeHandle[]
          }
        }
      ],
      floating: [
        // {
        //   id: 'popup-3',
        //   component: <div>Hello World 3</div>,
        //   settings: {
        //     icon: <i className="fa-solid fa-sliders text-base" />,
        //     title: 'Popup 3',
        //     allowLeftSide: true,
        //     allowRightSide: true,
        //     resizeHandles: ['se'] as ResizeHandle[]
        //   }
        // }
      ]
    };

    return (
      <div className="flex border border-solid border-gray-300">
        <PopupProvider popups={popups} multiSelect canHide onChange={(value: Popups) => console.log(value)}>
          <div className="flex grow h-[500px] bg-gray-200"></div>
        </PopupProvider>
      </div>
    );
    // return <Popup {...args} />;
  }
};
