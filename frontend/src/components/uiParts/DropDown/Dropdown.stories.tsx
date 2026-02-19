import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown } from './presenter'

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
}

export default meta

type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
  args: {
    buttonText: 'Open',
    listItems: [
      { text: 'One', value: '1' },
      { text: 'Two', value: '2' },
    ],
    theme: 'primary',
    register: {},
  },
}
