import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextMessage } from './presenter'

const meta = {
  title: 'UI/TextMessage',
  component: TextMessage,
  tags: ['autodocs'],
  args: {
    text: 'テキストメッセージ',
    theme: 'primary',
    size: 'base',
    underline: false,
  },
} satisfies Meta<typeof TextMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Underlined: Story = {
  args: {
    theme: 'secondary',
    underline: true,
    text: '下線つきメッセージ',
  },
}

export const LargeSuccess: Story = {
  args: {
    theme: 'success',
    size: '2xl',
    text: '成功メッセージ（大）',
  },
}

export const DangerSmall: Story = {
  args: {
    theme: 'danger',
    size: 'sm',
    text: 'エラーメッセージ（小）',
  },
}
