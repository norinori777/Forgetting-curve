import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './presenter'
import type { theme } from '../../../utils/theme/types'

const meta: Meta<typeof TextField> = {
  title: 'UI/TextField',
  component: TextField,
}

export default meta

type Story = StoryObj<typeof TextField>

export const Primary: Story = {
  args: {
    id: 'sample-id',
    label: 'ラベル',
    placeholder: '入力してください',
    description: '補足説明',
    theme: 'primary' as theme,
    register: {},
  },
}
