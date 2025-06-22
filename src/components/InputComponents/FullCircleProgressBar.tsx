
interface Props{
    value: number
    size: number
    fontsize: number
    thickness: number
    customText? : string
}
export default function FullCircleProgressBar(p: Props) {
    return (
        <div className="relative" style={{width: p.size, height: p.size}}>
            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200" strokeWidth={p.thickness}></circle>
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-blue-700  transition-all duration-1000 ease-in-out" strokeWidth={p.thickness} strokeDasharray="100" strokeDashoffset={`${100-p.value}`} strokeLinecap="round"></circle>
            </svg>
          
            <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span className="text-center text-gray-800" style={{fontSize: p.fontsize}}>
                    {p.customText ? p.customText : p.value + "%"}
                </span>
            </div>
        </div>
    )
}
