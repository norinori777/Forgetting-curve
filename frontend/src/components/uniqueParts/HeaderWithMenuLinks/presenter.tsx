import { Header } from '../../uiParts/Header'
import { HeaderMenu, type HeaderMenuProps } from '../../uiParts/HeaderMenu'
import { HeaderTitle, type HeaderTitleProps } from '../../uiParts/HeaderTitle'

export interface HeaderWithMenuLinksPresenterProps {
  title: HeaderTitleProps
  menu: HeaderMenuProps
}

export const HeaderWithMenuLinksPresenter = (props: HeaderWithMenuLinksPresenterProps) => {
  return (
    <Header>
      <HeaderTitle {...props.title} />
      <div className="flex-1 pr-4">
        <HeaderMenu {...props.menu} />
      </div>
    </Header>
  )
}
