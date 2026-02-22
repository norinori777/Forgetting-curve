import { Link, useLocation } from 'react-router-dom'
import { TextMessage } from '../TextMessage'

export interface RouterLinkItemProps {
  text: string
  link: string
  select: (text: string) => void
  underline: boolean
  className?: string
  theme: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'normal' | 'white' | 'black'
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
}

export const RouterLinkItem = (props: RouterLinkItemProps) => {
  const handleClick = () => props.select(props.text)
  const location = useLocation()

  const linkClassName = ['font-medium', props.className].filter(Boolean).join(' ')

  return (
    <>
      <Link
        data-testid="linkItem"
        onClick={handleClick}
        className={linkClassName}
        to={props.link}
        state={{previousLocationPath: location.pathname, nextLocationPath: props.link}}>
        <TextMessage
          theme={props.theme}
          text={props.text}
          size={props.size}
          underline={props.underline}
        />
      </Link>
    </>
  )
}