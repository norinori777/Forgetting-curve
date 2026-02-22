import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HeaderTitle } from './presenter'

describe('HeaderTitle', () => {
  it('アイコンとアプリ名を表示する', () => {
    render(
      <HeaderTitle
        appName="Forgetting Curve"
        iconSrc="/logo.png"
        iconAlt="logo"
      />
    )

    expect(screen.getByText('Forgetting Curve')).toBeTruthy()
    expect(screen.getByAltText('logo')).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('タイトル文字に theme と size を適用する', () => {
    render(
      <HeaderTitle
        appName="Forgetting Curve"
        iconSrc="/logo.png"
        iconAlt="logo"
        theme="primary"
        size="xl"
      />
    )

    const title = screen.getByText('Forgetting Curve')
    expect(title.className).toContain('text-xl')
    expect(title.className).toContain('text-primary-dark')
  })

  it('to が指定された場合に Link でラップする', () => {
    render(
      <MemoryRouter>
        <HeaderTitle
          appName="Forgetting Curve"
          iconSrc="/logo.png"
          iconAlt="logo"
          to="/"
        />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: /Forgetting Curve/ })
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toBe('/')
  })
})
