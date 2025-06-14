import type { ReactNode } from "react"

interface Props{
    open: boolean
    onClose: () => void
    children: ReactNode
    top?: boolean
}
export default function Model({open, onClose, children, top}: Props) {
    return (
        <div className={`fixed inset-0  transition-colors 
            ${open ? "visible bg-black/60" : "invisible"} `}
            onClick={onClose}>
            <div className={`bg-stone-800 fixed rounded-md flex justify-center items-center max-w-100 w-[80%] ${top ? "top-1/4 " : "top-1/2 -translate-y-1/2"} left-1/2 transform -translate-x-1/2`}
                onClick={e => e.stopPropagation()}>
                {children}  
            </div>
        </div>
    )
}
