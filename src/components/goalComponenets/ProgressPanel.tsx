import FullCircleProgressBar from "../InputComponents/FullCircleProgressBar";

interface Props{
    value: number
    title: string
    text: string
    size? : number
}
export default function ProgressPanel(p: Props) {
        
    return (
        <div className="w-[90%] max-w-[600px] flex  gap-5  bg-stone-800 p-5  rounded-md text-stone-300 font-mono items-center">
            <div>
                <FullCircleProgressBar value={Math.round(p.value)} size={p.size ?? 70} fontsize={20} thickness={2}/>
            </div>
            <div className="flex flex-col justify-center mb-0.5">
                <p className="text-xl text-stone-300">
                    {p.title}
                </p>
                <p className="text-stone-400 mt-1 text-sm">
                    {p.text}
                </p>
            </div>
            
        </div>
    )
}
