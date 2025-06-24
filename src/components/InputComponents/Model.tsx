import type { ReactNode } from "react"

interface Props{
    open: boolean
    onClose: () => void
    children: ReactNode
}
export default function Model({open, onClose, children}: Props) {
    return (
        <div className={`fixed inset-0  transition-colors  z-50 ${open ? "visible bg-black/60" : "invisible"} `}
            onClick={onClose}>
            <div className={` fixed  rounded-md flex w-screen justify-center  items-center top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4`}
                onClick={e =>{
                     e.stopPropagation()
                     onClose()
                }}>
                {children}  
            </div>
        </div>
    )
}
