import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Dropdown } from './presenter'

describe('Dropdown', () => {
  it('renders button and toggles dropdown', () => {
    const { getByText, container } = render(
      <Dropdown
        buttonText="Open"
        listItems={[{ text: 'One', value: '1' }, { text: 'Two', value: '2' }]}
        theme={'primary'}
        register={{}}
      />
    )

    const button = getByText('Open')
    const dropdown = container.querySelector('#dropdown') as HTMLElement
    expect(button).toBeTruthy()
    expect(dropdown.className).toContain('hidden')

    fireEvent.click(button)
    expect(dropdown.className).not.toContain('hidden')

    const item = getByText('One')
    fireEvent.click(item)

    const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement
    expect(hiddenInput.value).toBe('1')
    expect(dropdown.className).toContain('hidden')
  })
})
