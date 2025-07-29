import ProgressBar from "../InputComponents/ProgressBar";

interface Props{
    value: number
    title: string
    roundTo?: number
    text?: string
    large? : boolean
    small? : boolean
}
export default function ProgressPanel(p: Props) {
      
    const roundVal = Number(`1`.padEnd((p.roundTo ?? 0) + 1, "0"))

    return (
        <div className="w-full max-w-[700px] text-title  flex flex-col ">
            <p className={` ${p.small ? "font-normal text-subtext1 text-sm" : "font-medium"} mt-[-4px] ${p.large ? "text-lg" : ""}`}>
                {p.title}
            </p>
            {p.text ? 
                <p className="mt-1 text-xs text-subtext2 mb-1.5 max-w-[90%]">
                    {p.text}
                </p>      
            :"" }
            <div className="w-full flex justify-stretch items-center gap-2 mt-2">
                <div className="w-full">
                    <ProgressBar min={0} max={100} current={p.value} />
                </div>
                <p className="text-subtext2 text-xs leading-none mb-1">
                    {Math.min(Math.round(p.value*roundVal)/roundVal, 100)}%
                </p>
            </div>
           
        </div>
    )
}
