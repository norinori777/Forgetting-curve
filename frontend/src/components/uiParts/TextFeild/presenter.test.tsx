import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TextField } from './presenter'

describe('TextField', () => {
  it('renders label, input and description', () => {
    const { getByLabelText, getByText } = render(
      <TextField id="id" label="My Label" placeholder="ph" description="desc" theme={'primary'} register={{}} />
    )

    const input = getByLabelText('My Label') as HTMLInputElement
    expect(input).toBeTruthy()
    expect(input.placeholder).toBe('ph')
    expect(getByText('desc')).toBeTruthy()
  })

  it('toggles label text class on focus and blur', () => {
    const { getByLabelText, getByText } = render(
      <TextField id="id2" label="Focus Label" placeholder="ph" description="desc" theme={'primary'} register={{}} />
    )

    const input = getByLabelText('Focus Label') as HTMLInputElement
    const label = getByText('Focus Label') as HTMLElement

    // initial should have gray text
    expect(label.className).toContain('text-gray-500')

    fireEvent.focus(input)
    // after focus should use theme text
    expect(label.className).toContain('text-primary-default')

    fireEvent.blur(input)
    // after blur goes back to gray
    expect(label.className).toContain('text-gray-500')
  })
})
