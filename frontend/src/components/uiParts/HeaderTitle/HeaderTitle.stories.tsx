import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { HeaderTitle } from './presenter'

const meta: Meta<typeof HeaderTitle> = {
  title: 'UI/HeaderTitle',
  component: HeaderTitle,
}

export default meta

type Story = StoryObj<typeof HeaderTitle>

export const Default: Story = {
  args: {
    appName: '忘却曲線',
    iconSrc: '/vite.svg',
    iconAlt: 'logo',
    theme: 'normal',
    size: 'base',
  },
}

export const WithLink: Story = {
  render: (args) => (
    <MemoryRouter>
      <HeaderTitle {...args} />
    </MemoryRouter>
  ),
  args: {
    appName: '忘却曲線',
    iconSrc: '/vite.svg',
    iconAlt: 'logo',
    to: '/',
    theme: 'normal',
    size: 'base',
  },
}
