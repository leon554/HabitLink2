import ProgressPanel from "../goalComponenets/ProgressPanel";
import { TbGauge } from "react-icons/tb";

interface Props{
    compRate: number
    strength: number
}
export default function ConsistencyPanel(p: Props) {
    
    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none bg-panel1 rounded-2xl text-title outline-1 outline-border w-full p-7 py-4 ">
            <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                    <TbGauge />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-title font-semibold leading-none pb-1">
                        Progression
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-3">   
                <ProgressPanel title={"Consistency"} value={Math.round(p.compRate*100)} small={true}/> 
                <ProgressPanel title={"Strength"} value={Math.round(p.strength)} small={true}/> 
            </div>
        </div>
    )
}
