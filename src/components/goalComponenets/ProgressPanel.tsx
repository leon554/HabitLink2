import { useContext, type ReactNode } from "react";
import ProgressBar from "../InputComponents/ProgressBar";
import { UserContext } from "../Providers/UserProvider";
import { AiOutlineLoading } from "react-icons/ai";

interface Props{
    value: number
    title: string
    icon?: ReactNode
    roundTo?: number
    text?: string
    large? : boolean
    small? : boolean
    load?: boolean
}
export default function ProgressPanel(p: Props) {
      
    const roundVal = Number(`1`.padEnd((p.roundTo ?? 0) + 1, "0"))
    const HC = useContext(UserContext)
    const loading = HC.isCalculating.current.isLoading()

    return (
        <div className="w-full max-w-[700px] text-title  flex flex-col ">
            <div className="flex items-center gap-3 ">
                {p.icon ? 
                <p className="rounded-lg bg-panel2 border-1 border-border2 p-1.5 text-subtext2">
                    {p.icon}
                </p>
                
                : ""}
                <p className={` ${p.small ? "font-normal text-subtext2 text-sm" : "font-medium"} mt-[-4px] ${p.large ? "text-md" : ""}`}>
                    {p.title}
                </p>
            </div>
            {p.text ? 
                <p className="mt-1 text-xs text-subtext2 mb-1.5 max-w-[90%]">
                    {p.text}
                </p>      
            :"" }
            <div className="w-full flex justify-stretch items-center gap-2 mt-2">
                <div className="w-full">
                    <ProgressBar min={0} max={100} current={p.load && loading ? 0 : p.value} />
                </div>
                <p className="text-subtext2 text-xs leading-none mb-1">
                    {p.load && loading ? <AiOutlineLoading className="animate-spin  text-subtext2" size={10}/> : `${Math.min(Math.round(p.value*roundVal)/roundVal, 100)}%`}
                </p>
            </div>
           
        </div>
    )
}
