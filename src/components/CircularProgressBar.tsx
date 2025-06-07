
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
        <div className="relative w-40 h-30 ">
            <svg className="size-fit rotate-180" viewBox="0 0 36 36">
                
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-stone-700" stroke-width="1.5" stroke-dasharray="50 100" stroke-linecap="round"></circle>

                <circle cx="18" cy="18" r="16" fill="none" className={`stroke-current ${getColor()}`} stroke-width="1.5" stroke-dasharray={`${p.value/100*50} 100`} stroke-linecap="round"></circle>
            </svg>
            <div className="absolute top-9 start-1/2 transform -translate-x-1/2 text-center ">
                <span className="text-2xl text-stone-400 font-mono">{p.value}%</span>
                <span className="text-sm text-stone-400 font-san block mt-1 ">{p.text}</span>
            </div>
        </div>
    )
}
