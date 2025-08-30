import { useState } from "react";
import { type ReactNode } from "react";

interface Props {
    children: ReactNode;
    tooltip: ReactNode;
}

export default function ToolTip(p: Props) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex relative w-full"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
           onClick={e => {
                e.stopPropagation();
                setIsHovered(prev => !prev);
            }}
        >
            {p.children}
            <div
                className={`absolute z-10 origin-bottom bottom-full mb-2 left-1/2 -translate-x-1/2 
                ${isHovered ? 'scale-100 delay-200' : 'scale-0'} transition-all duration-250 ease-in-out`}
                onClick={e => e.stopPropagation()}
            >
                {p.tooltip}
            </div>
        </div>
    );
}
