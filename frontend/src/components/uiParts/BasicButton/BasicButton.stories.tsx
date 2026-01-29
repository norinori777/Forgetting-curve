import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BasicButton } from './presernter'

const meta = {
  title: 'UI/BasicButton',
  component: BasicButton,
  tags: ['autodocs'],
} satisfies Meta<typeof BasicButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Primary',
    theme: 'primary',
    type: 'button',
    action: fn(),
  },
}

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    theme: 'secondary',
    type: 'button',
    action: fn(),
  },
}
