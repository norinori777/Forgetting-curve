import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, test, expect } from 'vitest'
import { BasicButton } from './presernter'

test('BasicButton renders and triggers action on click', async () => {
  const onClick = vi.fn()
  render(<BasicButton label="Click me" theme="primary" type="button" action={onClick} />)
  const btn = screen.getByText('Click me')
  await userEvent.click(btn)
  expect(onClick).toHaveBeenCalled()
})
