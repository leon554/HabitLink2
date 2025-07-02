import { type ReactNode } from "react"


interface Props{
    children: ReactNode
    tooltip: ReactNode
}
export default function ToolTip(p: Props) {
    
    return (
        <div className="flex relative w-full group ">
            {p.children}
            <div className="absolute z-10 origin-bottom bottom-full mb-2 left-1/2 -translate-x-1/2  scale-0 group-hover:scale-100 transition-all duration-250 ease-in-out group-hover:delay-200">
                {p.tooltip}
            </div>
        </div>
    )
}
