
interface Props{
    value: number
    text: string
}
export default function CircularProgressBar(p: Props) {
    function getColor(){
        const v = p.value
        return v <= 10 ? 
        "text-red-400" :
        v < 40 ? 
        "text-orange-400" :
        v < 70 ? 
        "text-yellow-400" :
        "text-green-400"
    }
    return (
       <div className="relative sm:w-50 w-40 sm:h-30 h-25">
            <svg className="size-fit rotate-180" viewBox="0 0 36 36">
                <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-progress-panel"
                strokeWidth="1.5"
                strokeDasharray="50 100"
                strokeLinecap="round"
                ></circle>

                <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={`stroke-current ${getColor()} transition-all duration-1000 ease-in-out`}
                strokeWidth="1.5"
                strokeDasharray={`${(p.value / 100) * 50} 100`}
                strokeLinecap="round"
                ></circle>
            </svg>
            <div className="absolute sm:top-11 top-9 start-1/2 transform -translate-x-1/2 text-center">
                <span className="text-2xl text-subtext2 font-mono">{p.value}%</span>
                <span className="text-sm text-subtext2 font-mono block mt-1">{p.text}</span>
            </div>
        </div>
    )
}
