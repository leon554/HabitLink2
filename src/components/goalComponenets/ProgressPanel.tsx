import FullCircleProgressBar from "../InputComponents/FullCircleProgressBar";

interface Props{
    value: number
    title: string
    text: string
    size? : number
}
export default function ProgressPanel(p: Props) {
        
    return (
        <div className="w-[90%] max-w-[600px] flex  gap-5 p-5  bg-panel1 rounded-2xl text-title drop-shadow-sm outline-border outline-1 items-center">
            <div>
                <FullCircleProgressBar value={Math.round(p.value)} size={p.size ?? 70} fontsize={20} thickness={2}/>
            </div>
            <div className="flex flex-col justify-center mb-0.5">
                <p className="text-xl ">
                    {p.title}
                </p>
                <p className="mt-1 text-sm text-subtext2">
                    {p.text}
                </p>
            </div>
            
        </div>
    )
}
