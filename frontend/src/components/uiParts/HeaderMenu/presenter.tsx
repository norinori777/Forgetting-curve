import { RouterLinkItem } from '../RouterLinkItem'
import type { ComponentProps } from 'react'

type TextMessageTheme = ComponentProps<typeof RouterLinkItem>['theme']
type TextMessageSize = ComponentProps<typeof RouterLinkItem>['size']

export interface HeaderMenuItem {
  label: string
  to: string
}

export interface HeaderMenuProps {
  items: HeaderMenuItem[]
  theme?: TextMessageTheme
  size?: TextMessageSize
}

export const HeaderMenu = (props: HeaderMenuProps) => {
  const theme = props.theme ?? 'primary'
  const size = props.size ?? 'base'

  return (
    <nav aria-label="Header menu">
      <ul className="flex flex-row space-x-4 md:justify-around max-md:gap-2">
        {props.items.map((item) => {
          return (
            <li key={item.label}>
              <RouterLinkItem
                text={item.label}
                link={item.to}
                select={() => {}}
                underline={false}
                theme={theme}
                size={size}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}