import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TextMessage } from './presenter'

describe('TextMessage', () => {
  test('text が表示されること', () => {
    render(<TextMessage text="Hello" theme="primary" size="base" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  test('size に応じたクラスが付与されること', () => {
    render(<TextMessage text="Sized" theme="primary" size="2xl" />)
    const el = screen.getByText('Sized')
    expect(el).toHaveClass('text-2xl')
  })

  test('theme に応じたクラスが付与されること（dark theme）', () => {
    render(<TextMessage text="Themed" theme="success" size="base" />)
    const el = screen.getByText('Themed')
    expect(el).toHaveClass('text-success-dark')
  })

  test('underline=true の場合 underline クラスが付与されること', () => {
    render(<TextMessage text="Underlined" theme="normal" size="base" underline />)
    const el = screen.getByText('Underlined')
    expect(el).toHaveClass('underline')
  })

  test('underline が未指定の場合 underline クラスが付与されないこと', () => {
    render(<TextMessage text="Not Underlined" theme="normal" size="base" />)
    const el = screen.getByText('Not Underlined')
    expect(el).not.toHaveClass('underline')
  })
})
