import ProgressBar from "../InputComponents/ProgressBar";

interface Props{
    value: number
    title: string
    text?: string
    size? : number
}
export default function ProgressPanel(p: Props) {
        
    return (
        <div className="w-full max-w-[700px] text-title  flex flex-col">
            <p className="">
                {p.title}
            </p>
            {p.text ? 
                <p className="mt-0.5 text-xs text-subtext2 mb-1">
                    {p.text}
                </p>      
            :"" }
            <div className="w-full flex justify-stretch items-center gap-2 mt-2">
                <div className="w-full">
                    <ProgressBar min={0} max={100} current={p.value} />
                </div>
                <p className="text-subtext2 text-xs leading-none mb-1">
                    {Math.round(p.value)}%
                </p>
            </div>
           
        </div>
    )
}
