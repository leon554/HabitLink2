import type { ReactNode } from "react"
import { useEffect } from "react"

interface Props{
    open: boolean
    onClose: () => void
    children: ReactNode
}
export default function Model({open, onClose, children}: Props) {

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'hidden'
        };
    }, [open]);
    useEffect(() => {
        if (!open) {
            window.scrollTo({ top: 0, left: 0 });
        }
    }, [open]);

    return (
        <div className={`fixed z-10 inset-0  ${open ? "visible bg-black/60 overflow-hidden" : "invisible"} `}
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
