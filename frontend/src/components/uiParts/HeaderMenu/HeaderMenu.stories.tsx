import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { HeaderMenu } from './presenter'

const meta: Meta<typeof HeaderMenu> = {
  title: 'UI/HeaderMenu',
  component: HeaderMenu,
}

export default meta

type Story = StoryObj<typeof HeaderMenu>

export const Default: Story = {
  render: (args) => (
    <MemoryRouter>
      <HeaderMenu {...args} />
    </MemoryRouter>
  ),
  args: {
    items: [
      { label: 'ホーム', to: '/' },
      { label: '新規登録', to: '/learning-items/new' },
      { label: '統計', to: '/statistics' },
    ],
    theme: 'primary',
    size: 'base',
  },
}
