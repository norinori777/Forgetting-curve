import type { HeaderTitleProps } from '../../uiParts/HeaderTitle'
import type { HeaderMenuItem, HeaderMenuProps } from '../../uiParts/HeaderMenu'
import { HeaderWithMenuLinksPresenter } from './presenter'

export interface HeaderWithMenuLinksProps {
  title: HeaderTitleProps
  menuItems: HeaderMenuItem[]
  menuTheme?: HeaderMenuProps['theme']
  menuSize?: HeaderMenuProps['size']
}

export const HeaderWithMenuLinks = (props: HeaderWithMenuLinksProps) => {
  return (
    <HeaderWithMenuLinksPresenter
      title={props.title}
      menu={{
        items: props.menuItems,
        theme: props.menuTheme,
        size: props.menuSize,
      }}
    />
  )
}
