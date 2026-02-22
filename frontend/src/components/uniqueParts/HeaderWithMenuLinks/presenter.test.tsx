import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HeaderWithMenuLinksPresenter } from './presenter'

describe('HeaderWithMenuLinksPresenter', () => {
  it('タイトルリンク + メニューリンクを表示する', () => {
    render(
      <MemoryRouter>
        <HeaderWithMenuLinksPresenter
          title={{
            appName: 'Forgetting Curve',
            iconSrc: '/dummy.svg',
            iconAlt: 'app icon',
            to: '/',
          }}
          menu={{
            items: [
              { label: 'ホーム', to: '/' },
              { label: '新規登録', to: '/learning-items/new' },
              { label: '統計', to: '/statistics' },
            ],
          }}
        />
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')
    expect(links.length).toBe(4)

    expect(screen.getByRole('link', { name: 'Forgetting Curve' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'ホーム' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: '新規登録' }).getAttribute('href')).toBe('/learning-items/new')
    expect(screen.getByRole('link', { name: '統計' }).getAttribute('href')).toBe('/statistics')
  })

  it('nav に aria-label="Header menu" が付与される', () => {
    render(
      <MemoryRouter>
        <HeaderWithMenuLinksPresenter
          title={{
            appName: 'Forgetting Curve',
            iconSrc: '/dummy.svg',
            iconAlt: 'app icon',
          }}
          menu={{ items: [{ label: 'ホーム', to: '/' }] }}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation', { name: 'Header menu' })).toBeTruthy()
  })
})
