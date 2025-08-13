import { useContext, useRef, useState, useEffect} from "react"
import ToolTip from "../ToolTip"
import { dateUtils } from "@/utils/dateUtils"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"
import { Util } from "@/utils/util"
import { IoInformationCircleOutline } from "react-icons/io5"
import Model from "../InputComponents/Model"


export default function HabitCalander() {

    const HC = useContext(UserContext)
    const [open, setOpen] = useState(false)
    const {firstResult: compDays, maxMiss, maxComp} = HabitUtil.GetCompletionDaysThisPeriodAllHabits(Util.fetchAllMapItems(HC.habits), HC.habitsCompletions) ?? []
    const days = ["S", "M", "T", "W", "T", "F", "S", " "]
    const calanderRef = useRef<HTMLDivElement>(null)
    const [columns, setColumns] = useState(16)

    useEffect(() => {
        if (!calanderRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width
                setColumns(prev => {
                    if (width < 390 && prev !== 12) return 12;
                    if (width > 410 && prev !== 16) return 16;
                    return prev
                });
            }
        });

        observer.observe(calanderRef.current);

        return () => observer.disconnect();
    }, []);


    return (
        <div className="m-7 flex flex-col  gap-5">
            <p className="text-title text-lg font-medium">
                Habit Entries
            </p>
            <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer absolute top-3 right-3" onClick={() => {
                setOpen(true)
            }}/>
            <div className="w-full  min-w-0 " ref={calanderRef}>
                <div className="flex gap-1.5 ">
                    <div className="flex flex-col  gap-1.5 mr-0.5 ">
                        {Array(8).fill(null).map((_, i) => {
                            return(
                                <p className="flex items-center text-xs font-mono text-subtext3 ">
                                    {days[i]}
                                </p>
                            )
                        })}  
                    </div>
                    {compDays.map((d, i) => {
                        if(compDays.length - i <= columns){
                            return(
                                <div key={i} className="flex flex-col items-center gap-1.5 w-full min-w-4 ">
                                    {d.reverse().map(v => {
                                        return(
                                            <ToolTip tooltip={
                                                <div className="rounded-2xl bg-panel2 outline-1 outline-border2 p-3 max-w-[600px] w-30">
                                                    <div className=" text-xs text-center text-subtext2 w-full">
                                                        {dateUtils.formatDate(v.day)} {dateUtils.isDatesSameDay(v.day , new Date()) ? "Today" : ""}  {getDayStatus(v)} 
                                                    </div>
                                                </div>
                                            }>
                                                <p className={`w-full h-4  border-border2/70 
                                                    ${v.completeAmount != 0 || v.missAmount != 0? "border-0" : "border-1"}  
                                                    ${v.creation ? "" : "rounded-sm "}
                                                    hover:scale-[1.2] transition-all hover:cursor-default ${HC.isCalculating.current.isLoading() ? "animate-pulse duration-1000 border-1" : "duration-200"}`}
                                                    style={{backgroundColor:  HC.isCalculating.current.isLoading() ? "#1a1a1a": v.completeAmount - v.missAmount < 0 ? 
                                                        Util.getInterpolatedColor(0, maxMiss, Math.max((v.missAmount), 0), "#0f0f0f", "#ef4444"):
                                                        Util.getInterpolatedColor(0, maxComp, Math.max((v.completeAmount), 0), "#0f0f0f", "#22c55e")}}>

                                                </p>
                                            </ToolTip>
                                        )
                                    })}
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="m-5 mx-7 flex flex-col gap-2 w-[80%] max-w-[600px] bg-panel1 rounded-2xl p-8 " onClick={e => e.stopPropagation()}>
                    <p className="text-lg text-title font-medium">
                        Calander Info
                    </p>
                    <p className="text-sm text-subtext2">
                        To view the info of any sqaure simply just hover over that sqaure.
                    </p>
                    <p className="text-sm text-subtext2 mt-2">
                        When hovering over a sqaure you will see these emojis: ❌✅📊
                    </p>
                    <p className="text-sm text-subtext2 mt-2">
                        ❌ Represents all the habits that was set to be completed but wasn't on a specific day.
                    </p>
                    <p className="text-sm text-subtext2 mt-2">
                        ✅ Represents all the habits that was completed regardless if they were due or not.
                    </p>
                    <p className="text-sm text-subtext2 mt-2">
                        📊 Represents the total number of habits you have on a given day. Note: ✅ + ❌ may not equal 📊 because some habits are defined by a weekly target (e.g., 3 times per week) rather than fixed days (e.g., Mon/Wed/Fri). If such a habit isn't completed, the system cannot determine which specific days were missed, only that the weekly goal was unmet.
                    </p>
                    <button className="bg-btn rounded-xl text-btn-text font-mono py-1 mt-5 hover:cursor-pointer"
                        onClick={() => setOpen(false)}>
                        Done
                    </button>
                </div>
            </Model>
        </div>
    )
}

function getDayStatus(day: {creation: boolean, missAmount: number, completeAmount: number, day: Date, totalHabits: number}){
    return(
        <>
            {day.creation ? 
            <p>
               Habit Creation
            </p>: ""}
            <div className="flex flex-wrap justify-center gap-1">
                <p>
                    ❌ {day.missAmount} 
                </p>
                <p>
                    ✅ {day.completeAmount}
                </p>
                <p>
                    📊 {day.totalHabits}
                </p>
            </div>
        </>
    )
}