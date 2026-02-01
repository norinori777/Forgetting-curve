import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BasicTable } from './presernter'

interface TestItem {
    id: number
    name: string
    active: boolean
    [key: string]: string | number | boolean
}

describe('BasicTable', () => {
    test('データがない場合、 "データがありません。" が表示されること', () => {
        render(<BasicTable<TestItem> titleHeader={['ID', 'Name', 'Active']} items={null} />)
        expect(screen.getByText('データがありません。')).toBeInTheDocument()
    })

    test('itemsの数だけrowが表示されること', () => {
        const items: TestItem[] = [
            { id: 1, name: 'Item 1', active: true },
            { id: 2, name: 'Item 2', active: false },
        ]
        render(<BasicTable<TestItem> titleHeader={['id', 'name', 'active']} items={items} />)
        expect(screen.getAllByRole('row')).toHaveLength(3)
    })

    test('表のヘッダーとデータが正しく表示されること', () => {
        const items: TestItem[] = [
            { id: 1, name: 'Item 1', active: true },
            { id: 2, name: 'Item 2', active: false },
        ]
        render(<BasicTable<TestItem> titleHeader={['id', 'name', 'active']} items={items} />)

        // Check headers
        expect(screen.getByText('id')).toBeInTheDocument()
        expect(screen.getByText('name')).toBeInTheDocument()
        expect(screen.getByText('active')).toBeInTheDocument()

        // Check data
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('Item 1')).toBeInTheDocument()
        expect(screen.getByText('有効')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('Item 2')).toBeInTheDocument()
        expect(screen.getByText('無効')).toBeInTheDocument()

        expect(screen.getAllByRole('row')).toHaveLength(3)
    })
})