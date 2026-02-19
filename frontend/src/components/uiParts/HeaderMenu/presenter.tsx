import { RouterLinkItem } from '../RouterLinkItem'

interface ListLinkItemsProps {
  items: {
    text: string
    initialLink: string
  }[]
}

export const HeaderMenu = (props: ListLinkItemsProps) => {
  return (
    <div className="flex flex-row space-x-4 md:justify-around max-md:gap-2">
      {props.items.map((item) => {
        return <RouterLinkItem key={item.text} text={item.text} link={item.initialLink} select={() => {}} underline={false} theme="primary" size="base" />
      })}
    </div>
  )
}