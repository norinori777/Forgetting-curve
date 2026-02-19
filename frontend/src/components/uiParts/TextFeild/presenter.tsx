import type { theme } from '../../../utils/theme/types'
import { getFocusPlaceholderTheme, getFocusRingTheme, getFocusTextTheme, getTextTheme } from '../../../utils/theme/theme'
import { useState } from 'react'

interface TextFieldProps<T> {
  id: string
  label: string
  placeholder: string
  description: string
  theme: theme
  register: T
}

export const TextField = <T,>(props: TextFieldProps<T>) => {
  const [inputFocus, setInputFocus] = useState(false)

  const textTheme = inputFocus == true ? getTextTheme(props.theme) : 'text-gray-500'
  const focusTextTheme = getFocusTextTheme(props.theme)
  const focusRingTheme = getFocusRingTheme(props.theme)
  const focusPlaceholderTheme = getFocusPlaceholderTheme(props.theme)

  const onFocusHandle = () => {
    setInputFocus(true)
  }

  const onBlurHandle = () => {
    setInputFocus(false)
  }

  return (
    <div className="mb-6">
      <label htmlFor={props.id} className={`block mb-2 text-sm font-medium  ${textTheme}`}>
        {props.label}
      </label>
      <input
        type="text"
        id={props.id}
        className={`${focusRingTheme} ring-gray-300 ring-2 focus:ring-2 focus:outline-none ${focusTextTheme} placeholder-gray-300 ${focusPlaceholderTheme} text-sm rounded-lg block w-full p-2.5`}
        placeholder={props.placeholder}
        onFocus={onFocusHandle}
        onBlur={onBlurHandle}
        {...props.register}
      />
      <p className={`mt-2 text-sm ${textTheme}`}>{props.description}</p>
    </div>
  )
}