import ContainerFrame from './ContainerFrame';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ContainerFrame',
  component: ContainerFrame,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof ContainerFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: args => (
    <ContainerFrame
      {...args}
      css="body { background-color: orange; }"
      assets={{
        'static-1': {
          type: 'link',
          id: 'static-1',
          params: {
            type: 'text/css',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
            rel: 'stylesheet'
          }
        },
        'static-1-duplicated': {
          type: 'link',
          id: 'static-1',
          params: {
            type: 'text/css',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
            rel: 'stylesheet'
          }
        },
        'static-2': {
          type: 'link',
          id: 'static-2',
          params: {
            type: 'text/css',
            href: 'https://fonts.googleapis.com/css?family=Rubik:400|Bitter:400|Changa One:400|Droid Sans:400|Droid Serif:400|Exo:400|Great Vibes:400|Inconsolata:400|Lato:400|Merriweather:400|Montserrat:400|Open Sans:400|Oswald:400|PT Sans:400|PT Serif:400|Ubuntu:400|Varela:400|Varela Round:400|Vollkorn:400&amp;text=RubikBterChang ODodSsfExGVIclLMwpPTU',
            rel: 'stylesheet'
          }
        },
        'aHR0cHM6Ly93ZWJzaXRlLnBsaXR6aS5hcHAvcGx1Z2lucy83c0VBX3BsaXR6aS1wbHVnaW4tbG90dGllL3BsaXR6aS1wbHVnaW4tbG90dGllLmNzcw==':
          {
            type: 'link',
            id: 'aHR0cHM6Ly93ZWJzaXRlLnBsaXR6aS5hcHAvcGx1Z2lucy83c0VBX3BsaXR6aS1wbHVnaW4tbG90dGllL3BsaXR6aS1wbHVnaW4tbG90dGllLmNzcw==',
            params: {
              href: 'https://website.plitzi.app/plugins/7sEA_plitzi-plugin-lottie/plitzi-plugin-lottie.css',
              rel: 'stylesheet',
              type: 'text/css'
            }
          },
        'aHR0cHM6Ly93ZWJzaXRlLnBsaXR6aS5hcHAvcGx1Z2lucy9LdGowX3BsaXR6aS1wbHVnaW4tdHlwZWQvcGxpdHppLXBsdWdpbi10eXBlZC5jc3M=':
          {
            type: 'link',
            id: 'aHR0cHM6Ly93ZWJzaXRlLnBsaXR6aS5hcHAvcGx1Z2lucy9LdGowX3BsaXR6aS1wbHVnaW4tdHlwZWQvcGxpdHppLXBsdWdpbi10eXBlZC5jc3M=',
            params: {
              href: 'https://website.plitzi.app/plugins/Ktj0_plitzi-plugin-typed/plitzi-plugin-typed.css',
              rel: 'stylesheet',
              type: 'text/css'
            }
          }
      }}
    >
      <div>Hello World</div>
    </ContainerFrame>
  )
};
