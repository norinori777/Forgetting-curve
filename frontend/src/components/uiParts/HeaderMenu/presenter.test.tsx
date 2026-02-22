import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HeaderMenu } from './presenter'

describe('HeaderMenu', () => {
  it('メニュー項目の数だけリンクを表示する', () => {
    render(
      <MemoryRouter>
        <HeaderMenu
          items={[
            { label: 'ホーム', to: '/' },
            { label: '新規登録', to: '/learning-items/new' },
            { label: '統計', to: '/statistics' },
          ]}
        />
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')
    expect(links.length).toBe(3)
    expect(screen.getByRole('link', { name: 'ホーム' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: '新規登録' }).getAttribute('href')).toBe('/learning-items/new')
    expect(screen.getByRole('link', { name: '統計' }).getAttribute('href')).toBe('/statistics')
  })

  it('nav に aria-label="Header menu" が付与される', () => {
    render(
      <MemoryRouter>
        <HeaderMenu items={[{ label: 'ホーム', to: '/' }]} />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation', { name: 'Header menu' })).toBeTruthy()
  })
})
