import { getButtonBackGroundTheme } from '../../../utils/theme/theme'

export interface ButtonProps {
  label: string
  theme: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'normal'
  type: 'button' | 'submit' | 'reset' | undefined
  action?: () => void
}

export const BasicButton = (props: ButtonProps) => {
  const themeStyle = getButtonBackGroundTheme(props.theme)
  return (
    <>
      <button
        type={props.type}
        className={`text-white font-bold py-2 px-4 rounded ${themeStyle}`}
        onClick={props.action}
      >
        {props.label}
      </button>
    </>
  )
}