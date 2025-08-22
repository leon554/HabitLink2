import type { ReactNode } from "react"

interface Props{
    open: boolean
    onClose: () => void
    children: ReactNode
}
export default function Model({open, onClose, children}: Props) {
    return (
        <div className={`fixed z-10 inset-0  ${open ? "visible bg-black/60" : "invisible"} `}
            onClick={onClose}>
            <div className={` fixed  rounded-md flex w-screen justify-center  items-center left-1/2 transform -translate-x-1/2 mt-20`}
                onClick={e =>{
                     e.stopPropagation()
                     onClose()
                }}>
                {children}  
            </div>
        </div>
    )
}
