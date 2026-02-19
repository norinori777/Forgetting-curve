import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Header } from './presenter'

describe('Header', () => {
  it('renders children and has expected classes', () => {
    const { getByText, container } = render(<Header>Title</Header>)
    expect(getByText('Title')).toBeTruthy()

    const header = container.querySelector('header') as HTMLElement
    expect(header).toBeTruthy()
    expect(header.className).toContain('h-16')
    expect(header.className).toContain('border-b')
  })
})
