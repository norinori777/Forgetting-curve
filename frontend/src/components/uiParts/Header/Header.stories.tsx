import type { Meta, StoryObj } from '@storybook/react-vite'
import { Header } from './presenter'

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
}

export default meta

type Story = StoryObj<typeof Header>

export const Default: Story = {
  args: {
    children: 'ヘッダー',
  },
}
