import { Link } from 'react-router-dom'
import { TextMessage } from '../TextMessage'
import type { ComponentProps } from 'react'

type TextMessageTheme = ComponentProps<typeof TextMessage>['theme']
type TextMessageSize = ComponentProps<typeof TextMessage>['size']

export interface HeaderTitleProps {
  appName: string
  iconSrc: string
  iconAlt: string
  to?: string
  theme?: TextMessageTheme
  size?: TextMessageSize
}

export const HeaderTitle = (props: HeaderTitleProps) => {
  const theme = props.theme ?? 'normal'
  const size = props.size ?? 'base'

  const content = (
    <div className="flex flex-row items-center gap-2">
      <img className="h-8 w-8" src={props.iconSrc} alt={props.iconAlt} />
      <TextMessage text={props.appName} theme={theme} size={size} />
    </div>
  )

  if (props.to) {
    return (
      <Link aria-label={props.appName} className="flex flex-row items-center" to={props.to}>
        {content}
      </Link>
    )
  }

  return content
}
