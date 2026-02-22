import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { HeaderWithMenuLinks } from './container'

const meta: Meta<typeof HeaderWithMenuLinks> = {
  title: 'Unique/HeaderWithMenuLinks',
  component: HeaderWithMenuLinks,
}

export default meta
type Story = StoryObj<typeof HeaderWithMenuLinks>

export const Default: Story = {
  args: {
    title: {
      appName: 'Forgetting Curve',
      iconSrc: '/vite.svg',
      iconAlt: 'app icon',
      to: '/',
    },
    menuItems: [
      { label: 'ホーム', to: '/' },
      { label: '新規登録', to: '/learning-items/new' },
      { label: '統計', to: '/statistics' },
    ],
  },
  render: (args) => (
    <MemoryRouter>
      <HeaderWithMenuLinks {...args} />
    </MemoryRouter>
  ),
}
