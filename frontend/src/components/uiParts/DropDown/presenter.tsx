
import { useRef, useState } from 'react'

interface DropdownProps<T> {
    buttonText: string
    listItems: {
        text: string,
        value: string
    }[]
    theme: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'normal'
    register: T
}
export const Dropdown = <T,>(props: DropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const hiddenInputRef = useRef<HTMLInputElement | null>(null)

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const handleSelect = (value: string) => {
        if(hiddenInputRef.current){
            hiddenInputRef.current.value = value
            setIsOpen(false);
        }
    }

    return(
        <>
            <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" onClick={toggleDropdown}>{props.buttonText}
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            <div id="dropdown" className={`z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ${isOpen ? '' : 'hidden'}`}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <DropdownItem listItems={props.listItems} handleSelect={handleSelect} />
                </ul>
            </div>
            <input type="hidden" {...props.register}  ref={hiddenInputRef}/>
        </>

    )
}

interface DropdownItemProps {
    listItems: {
        text: string,
        value: string
    }[]
    handleSelect: (value: string) => void
}

const DropdownItem = (props: DropdownItemProps) => {
    const handleSelect = (value: string) => {
        props.handleSelect(value)
    }

    return (
        <>
            {props.listItems.map((item, index) => {
                return (
                    <li key={index} onClick={() => handleSelect(item.value)}>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item.text}</a>
                    </li>
                )
            })}
        </>
    )
}