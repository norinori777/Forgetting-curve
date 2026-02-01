import { getTextDarkTheme } from '../../../utils/theme/theme'

interface TextMessageProps {
  text: string
  theme: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'normal' | 'white' | 'black'
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  underline?: boolean
}

export const TextMessage = (props: TextMessageProps) => {
  const underline = props.underline ? 'underline' : ''
  const sizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  }
  const textSize = sizeMap[props.size] ?? 'text-base'
  const textTheme = getTextDarkTheme(props.theme)

  return (
    <>
      <p className={`${textSize} ${textTheme} ${underline}`}>{props.text}</p>
    </>
  )
}