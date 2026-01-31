import { useCallback, useMemo, useState } from 'react';

import Button from '@components/Button';

import PopupSidePanel from './components/PopupSidePanel';
import usePopup from './hooks/usePopup';
import Popup from './Popup';
import PopupProvider from './PopupProvider';
import PopupSidebar from './PopupSidebar';

import type { PopupPlacement } from './Popup';
import type { PopupInstance, Popups } from './PopupProvider';
import type { ResizeHandle } from '@components/ContainerResizable';
import type { Meta, StoryObj } from '@storybook/react';
import type { MouseEvent } from 'react';

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

const popups: Popups = {
  left: [
    {
      id: 'popup-1',
      component: <div className="h-150 bg-red-300">Hello World 1</div>,
      active: false,
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
      active: true,
      settings: {
        icon: <i className="fa-solid fa-plus" />,
        title: 'Popup 4',
        allowLeftSide: true,
        allowRightSide: true,
        resizeHandles: ['se'] as ResizeHandle[]
      }
    },
    {
      id: 'popup-8',
      component: <div>Hello World 8</div>,
      active: true,
      placementSettings: {
        left: { position: 1, minSize: 150 }
      },
      settings: {
        icon: <i className="fa-solid fa-house" />,
        title: 'Popup 8',
        allowLeftSide: true,
        allowRightSide: true,
        resizeHandles: ['se'] as ResizeHandle[]
      }
    },
    {
      id: 'popup-7',
      component: undefined,
      active: false,
      settings: {
        icon: <i className="fa-solid fa-plus" />,
        title: 'Popup 7',
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
      active: true,
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
      active: false,
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
    {
      id: 'popup-3',
      component: <div>Hello World 3</div>,
      active: true,
      settings: {
        icon: <i className="fa-solid fa-sliders text-base" />,
        title: 'Popup 3',
        allowLeftSide: true,
        allowRightSide: true,
        resizeHandles: ['se'] as ResizeHandle[]
      }
    },
    {
      id: 'popup-6',
      component: <div>Hello World 6</div>,
      active: true,
      settings: {
        icon: <i className="fa-solid fa-sliders text-base" />,
        title: 'Popup 6',
        allowLeftSide: true,
        allowRightSide: true,
        resizeHandles: ['se'] as ResizeHandle[]
      }
    }
  ]
};

export const Primary: Story = {
  args: {},
  render: () => {
    return (
      <div className="flex border border-solid border-gray-300 relative">
        <PopupProvider
          popups={popups}
          multi
          multiExpanded
          canHide
          onChange={(placement: PopupPlacement, value: PopupInstance[]) => console.log(placement, value)}
        >
          <div className="flex grow h-125 bg-gray-200"></div>
        </PopupProvider>
      </div>
    );
  }
};

const ContainerNested = () => {
  const { addPopup, existsPopup } = usePopup('right');

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!existsPopup('stateManager')) {
      addPopup('stateManager', <div>Hello World</div>, {
        icon: <i className="fa-solid fa-sliders text-base" />,
        title: 'State Manager',
        allowLeftSide: true,
        allowRightSide: true,
        placement: 'right',
        resizeHandles: ['se']
      });
    }
  };

  return (
    <div className="flex h-full">
      <div className="grow">
        Hello World 3
        <button className="px-2 py-1 rounded-sm text-white bg-orange-400" onClick={handleClick}>
          Click Me
        </button>
      </div>
      <PopupSidePanel
        className="overflow-y-auto max-h-[calc(100vh-48px)]"
        placementTabs="right"
        minWidth={320}
        maxWidth={540}
        canHide
      />
    </div>
  );
};

const Container = () => {
  const { addPopup, existsPopup } = usePopup('left');

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!existsPopup('stateManager')) {
      addPopup('stateManager', <div>Hello World</div>, {
        icon: <i className="fa-solid fa-sliders text-base" />,
        title: 'State Manager',
        allowLeftSide: true,
        allowRightSide: true,
        placement: 'left',
        resizeHandles: ['se']
      });
    }
  };

  const handleClick2 = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!existsPopup('stateManager2')) {
      addPopup('stateManager2', <div>Hello World 2</div>, {
        icon: <i className="fa-solid fa-sliders text-base" />,
        title: 'State Manager 2',
        allowLeftSide: true,
        allowRightSide: true,
        placement: 'left',
        resizeHandles: ['se']
      });
    }
  };

  const handleClick3 = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!existsPopup('stateManager3')) {
      addPopup(
        'stateManager3',
        <PopupProvider renderLeftPopup={false} renderRightPopup={false} renderFloatingPopup={false}>
          <ContainerNested />
        </PopupProvider>,
        {
          icon: <i className="fa-solid fa-sliders text-base" />,
          title: 'State Manager 3',
          allowLeftSide: true,
          allowRightSide: true,
          placement: 'floating',
          resizeHandles: ['se']
        }
      );
    }
  };

  return (
    <div className="flex gap-2">
      <button className="px-2 py-1 rounded-sm text-white bg-orange-400" onClick={handleClick}>
        Click Me
      </button>
      <button className="px-2 py-1 rounded-sm text-white bg-orange-400" onClick={handleClick2}>
        Click Me 2
      </button>
      <button className="px-2 py-1 rounded-sm text-white bg-orange-400" onClick={handleClick3}>
        Click Me 3
      </button>
    </div>
  );
};

export const SidePanelSeparated: Story = {
  args: {},
  render: function Render() {
    const [popupsActiveLeft, setPopupsActiveLeft] = useState<string[]>([]);

    const handleChangeProvider = useCallback(
      (placement: PopupPlacement, value: PopupInstance[]) => console.log(placement, value),
      []
    );

    const handleChangeLeft = useCallback((popups: string[]) => setPopupsActiveLeft(popups), []);

    console.log('storybook', popupsActiveLeft);

    return (
      <div className="flex border border-solid border-gray-300">
        <PopupProvider popups={popups} renderLeftPopup={false} multi canHide onChange={handleChangeProvider}>
          <div className="flex">
            <PopupSidebar
              placement="left"
              separatorsBefore={['popup-4']}
              canHide
              value={popupsActiveLeft}
              onChange={handleChangeLeft}
            />
            <PopupSidePanel
              showSidebar={false}
              className="overflow-y-auto max-h-[calc(100vh-48px)]"
              placementTabs="left"
              placement="left"
              separatorsBefore={['popup-4']}
              minWidth={335}
              maxWidth={540}
              canHide
              onChange={handleChangeLeft}
            />
          </div>
          <div className="flex grow h-125 bg-gray-200 items-center justify-center">
            <Container />
          </div>
        </PopupProvider>
      </div>
    );
  }
};

export const NestedProvider: Story = {
  args: {},
  render: () => {
    const popups = {
      left: [],
      right: [],
      floating: [
        {
          id: 'popup-3',
          component: (
            <PopupProvider renderLeftPopup={false} renderRightPopup={false} renderFloatingPopup={false}>
              <div>Hello World</div>
              <PopupSidePanel
                className="overflow-y-auto max-h-[calc(100vh-48px)]"
                placementTabs="right"
                minWidth={320}
                maxWidth={540}
                canHide
              />
            </PopupProvider>
          ),
          active: true,
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
      <div className="flex border border-solid border-gray-300">
        <PopupProvider
          popups={popups}
          multi
          canHide
          onChange={(placement: PopupPlacement, value: PopupInstance[]) => console.log(placement, value)}
        >
          <div className="flex grow h-125 bg-gray-200"></div>
        </PopupProvider>
      </div>
    );
  }
};

const getPopups = (id: string) => {
  return {
    left: [
      {
        id: 'popup-1',
        component: <div className="h-150 bg-red-300">Hello World 1 {id}</div>,
        active: true,
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
        component: <div className="h-150 bg-red-300">Hello World 2 {id}</div>,
        active: false,
        settings: {
          icon: <i className="fa-solid fa-sliders text-base" />,
          title: 'Popup 2',
          allowLeftSide: true,
          allowRightSide: true,
          resizeHandles: ['se'] as ResizeHandle[]
        }
      }
    ],
    floating: []
  };
};

export const DynamicPopups: Story = {
  args: {},
  render: function Render() {
    const [id, setId] = useState('Hello');

    const popups = useMemo(() => getPopups(id), [id]);

    const handleClick = useCallback(() => {
      if (id === 'Hello') {
        setId('World');
      } else {
        setId('Hello');
      }
    }, [id]);

    return (
      <div className="flex border border-solid border-gray-300">
        <PopupProvider
          popups={popups}
          multi
          canHide
          onChange={(placement: PopupPlacement, value: PopupInstance[]) => console.log(placement, value)}
        >
          <div className="flex grow h-125 bg-gray-200 items-center justify-center">
            <Button onClick={handleClick}>Click Me</Button>
          </div>
        </PopupProvider>
      </div>
    );
  }
};
