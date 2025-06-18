import type { ReactNode } from "react"

interface Props{
    open: boolean
    onClose: () => void
    children: ReactNode
    top?: boolean
    blur?: boolean
    positionX?: number
    positionY?: number
    fit?: boolean
}
export default function Model({open, onClose, children, top, blur, positionX, positionY, fit}: Props) {
    const showBlur = blur ?? true
    const fitSize = fit ?? true
    return (
        <div className={`fixed inset-0  transition-colors  z-40 
            ${open ? showBlur ? "visible bg-black/60" : "visible" : "invisible"} `}
            onClick={onClose}>
            <div className={` fixed  rounded-md flex justify-center items-center ${fitSize ? "max-w-600 w-[80%] bg-stone-800" : "w-fit"}
                ${top ? "top-1/4 " : "top-1/2 -translate-y-1/2"} ${!positionX && !positionY ? "left-1/2 transform -translate-x-1/2" : ""}`}
                style={{
                    top: positionY,
                    right: positionX
                }}
                onClick={e => e.stopPropagation()}>
                {children}  
            </div>
        </div>
    )
}
