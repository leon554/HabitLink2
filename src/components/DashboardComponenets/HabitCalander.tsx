import { useContext, useRef, useState, useEffect, useMemo} from "react"
import ToolTip from "../ToolTip"
import { dateUtils } from "@/utils/dateUtils"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"
import { Util } from "@/utils/util"
import { IoInformationCircleOutline } from "react-icons/io5"
import Model from "../InputComponents/Model"
import { TbCalendarMonthFilled } from "react-icons/tb";
import ButtonComp from "../primatives/ButtonComp"
import { colord } from "colord";
import { themeContext } from "../Providers/ThemeProvider"



export default function HabitCalander() {

    const HC = useContext(UserContext)
    const {dark} = useContext(themeContext)
    const [open, setOpen] = useState(false)
    const {firstResult: compDays, maxMiss, maxComp} = useMemo(() => HabitUtil.GetCompletionDaysThisPeriodAllHabits(Util.fetchAllMapItems(HC.habits), HC.habitsCompletions), [HC.habitsCompletions, HC.habits]) 
    const days = ["S", "M", "T", "W", "T", "F", "S", " "]
    const calanderRef = useRef<HTMLDivElement>(null)
    const [columns, setColumns] = useState(16)



    const [panel, setPanel] = useState(colord(getComputedStyle(document.documentElement).getPropertyValue('--color-panel2').trim()).toHex())
    const [highlight, setHighlight] = useState(colord(getComputedStyle(document.documentElement).getPropertyValue('--color-highlight').trim()).toHex())
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPanel(colord(getComputedStyle(document.documentElement).getPropertyValue("--color-panel2").trim()).toHex())   
            setHighlight(colord(getComputedStyle(document.documentElement).getPropertyValue('--color-highlight').trim()).toHex())
        }, 0);

        return () => clearTimeout(timeout);
    }, [dark])
    

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
        <div className="m-7 mt-4 flex flex-col  gap-5">
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-4 mb-2 mt-2">
                    <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                        <TbCalendarMonthFilled />
                    </div>
                    <p className="text-lg text-title font-semibold leading-none pb-1">
                        Habit Completions
                    </p>
                </div>
                <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer " onClick={() => {
                    setOpen(true)
                }}/>
            </div>
            <div className="w-full  min-w-0 " ref={calanderRef}>
                <div className="flex gap-1.5 ">
                    <div className="flex flex-col  gap-1.5 mr-0.5 ">
                        {Array(8).fill(null).map((_, i) => {
                            return(
                                <p 
                                    key={crypto.randomUUID()}
                                    className="flex items-center text-xs font-mono text-subtext3 ">
                                    {days[i]}
                                </p>
                            )
                        })}  
                    </div>
                    {compDays.map((d, i) => {
                        if(compDays.length - i <= columns){
                            return(
                                <div key={i} className="flex flex-col-reverse items-center gap-1.5 w-full min-w-4 mb-[5px]">
                                    {d.map(v => {
                                        return(
                                            <div className="h-4 w-full" key={crypto.randomUUID()}>
                                                <ToolTip tooltip={
                                                    <div className="rounded-2xl bg-panel2 outline-1 outline-border2 p-3 max-w-[600px] w-30">
                                                        <div className=" text-xs text-center text-subtext2 w-full">
                                                            {dateUtils.formatDate(v.day)} {dateUtils.isDatesSameDay(v.day , new Date()) ? "Today" : ""}  {getDayStatus(v)} 
                                                        </div>
                                                    </div>
                                                }>
                                                    <p className={`w-full h-4 bg-panel2 border-border2/70  shadow-sm shadow-gray-200 dark:shadow-none
                                                        ${v.completeAmount != 0 || v.missAmount != 0? "dark:border-0 border-1" : "dark:border-0 border-1"}  
                                                        ${v.creation ? "" : "rounded-sm "}
                                                        hover:scale-[1.2] transition-all hover:cursor-default ${HC.isCalculating.current.isLoading() ? "animate-pulse duration-1000 " : "duration-200"}`}
                                                        style={{backgroundColor:  HC.isCalculating.current.isLoading() ? panel: v.completeAmount - v.missAmount < 0 ? 
                                                            Util.getInterpolatedColor(0, maxMiss, Math.max((v.missAmount), 0), panel, "#ef4444"):
                                                            Util.getInterpolatedColor(0, maxComp, Math.max((v.completeAmount), 0), panel, highlight)}}>

                                                    </p>
                                                </ToolTip>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    })}
                </div>
                <div className="flex gap-4 justify-center mt-4">
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-sm bg-highlight "></div>
                        <p className="text-xs text-subtext3">
                            Completed
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-sm bg-red-500"></div>
                        <p className="text-xs text-subtext3">
                            Missed
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-sm dark:bg-[#1a1a1a] border-1 dark:border-0"></div>
                        <p className="text-xs text-subtext3">
                            No Data
                        </p>
                    </div>
                </div>
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className=" m-5 mx-7 flex flex-col gap-2 w-[80%] max-w-[600px] bg-panel1 rounded-2xl p-8 " onClick={e => e.stopPropagation()}>
                    <p className="text-lg text-title font-medium">
                        Calendar Info
                    </p>
                    <div className="flex flex-col gap-2 max-h-[40svh] overflow-y-scroll no-scrollbar">
                        <p className="text-sm text-subtext2">
                            To view the info of any square simply just hover over that square.
                        </p>
                        <p className="text-sm text-subtext2 mt-2">
                            When hovering over a square you will see these emojis: ❌✅📊
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
                    </div>
                    <ButtonComp
                        name={"Done"}
                        highlight={true}
                        onSubmit={() => setOpen(false)}
                        noAnimation={true}
                        style="mt-5"/>
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