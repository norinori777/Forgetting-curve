import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { BasicTable } from './presernter'

type StoryItem = {
  id: number
  name: string
  active: boolean
  [key: string]: string | number | boolean
}

const meta = {
  title: 'UI/BasicTable',
  // BasicTable はジェネリクスコンポーネントのため、Storybook の型付けは render 側で具体化する
  component: BasicTable as unknown as React.ComponentType,
  tags: ['autodocs'],
} satisfies Meta<React.ComponentType>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => <BasicTable<StoryItem> titleHeader={['id', 'name', 'active']} items={null} />,
}

export const WithRows: Story = {
  render: () => (
    <BasicTable<StoryItem>
      titleHeader={['id', 'name', 'active']}
      items={[
        { id: 1, name: 'Item 1', active: true },
        { id: 2, name: 'Item 2', active: false },
      ]}
    />
  ),
}
