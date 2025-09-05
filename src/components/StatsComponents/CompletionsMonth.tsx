import { useContext, useState, useRef, useEffect } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "../../utils/HabitUtil"
import { dateUtils } from "../../utils/dateUtils"
import { IoInformationCircleOutline } from "react-icons/io5";
import Model from "../InputComponents/Model";
import ToolTip from "../ToolTip";
import ButtonComp from "../primatives/ButtonComp";
import { TbCalendarClock } from "react-icons/tb";

export default function CompletionsMonth() {
    const HC = useContext(UserContext)
    const [open, setOpen] = useState(false)

    const currentHabitCompletions = HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined
    const compDays = HabitUtil.getCompletionDaysThisPeriod(HC.currentHabit!, currentHabitCompletions) ?? []
    const days = ["S", "M", "T", "W", "T", "F", "S", " "]
    const [openNotes, setOpenNotes] = useState(false)
    const [notes, setNotes] = useState<string[]>([])

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
        <div className="shadow-md shadow-gray-200 dark:shadow-none w-full bg-panel1  rounded-2xl outline-1 outline-border relative text-title justify-center p-7 pt-6 pb-7 flex flex-col items-center gap-4 ">
            <div className="w-full flex items-center mb-2 justify-between">
                 <div className="flex items-center gap-4">
                    <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 text-subtext2 outline-1 outline-border2 p-1.5 rounded-lg">
                        <TbCalendarClock />
                    </div>
                    <p className="text-title font-semibold leading-none pb-1">
                        Completion Calendar
                    </p>
                </div>
                <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer " onClick={() => {
                    setOpen(true)
                }}/>
            </div>
            <div className="w-full " ref={calanderRef}>
                <div className="flex gap-1.5  ">
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
                                <div key={i} className="flex flex-col items-center gap-1.5 w-full">
                                    {d.reverse().map(v => {
                                        return(
                                            <ToolTip tooltip={
                                                <div className="rounded-2xl bg-panel2 outline-1 outline-border2 p-3 max-w-[300px] flex flex-col items-center">
                                                    <p className=" text-xs text-center text-subtext2 w-full">
                                                        {dateUtils.formatDate(v.day)} {getDayStatus(v)} {dateUtils.isDatesSameDay(v.day , new Date()) ? "Today" : ""} {dateUtils.isDatesSameDay(new Date(Number(HC.currentHabit?.creationDate)) , v.day) ? "Creation Date" : ""}
                                                    </p>
                                                    {v.note != "" && v.note !== null? 
                                                        <ButtonComp
                                                            name={"Notes"}
                                                            xs={true}
                                                            highlight={false}
                                                            onSubmit={() =>{
                                                                setNotes(v.note.split(","))
                                                                setOpenNotes(true)
                                                            }}
                                                            style="w-full mt-2"/> : null
                                                    }
                                                </div>
                                            }>
                                                <p className={`shadow-sm shadow-gray-200 dark:shadow-none w-full h-4  outline-1 outline-border2 dark:outline-0 ${dateUtils.isDatesSameDay(v.day , new Date()) ? 
                                                    v.skip ? "bg-yellow-500 rounded-xl" :
                                                    v.done ? "bg-highlight rounded-xl" : "border-1 border-highlight rounded-sm" :
                                                    v.skip ? "bg-yellow-500 rounded-sm":
                                                    v.habitCreation ? 
                                                    v.done ? 
                                                    "rounded-none bg-highlight" :
                                                    v.complete ? 
                                                    "rounded-none bg-red-400" :
                                                    "border-1 rounded-none border-green-500" : 
                                                    v.done ?
                                                    "bg-highlight rounded-sm" : 
                                                    v.complete ? 
                                                    "bg-red-400 rounded-sm" : 
                                                    " bg-panel2 border-border2/70 rounded-sm"}  hover:scale-[1.2] transition-transform duration-200 hover:cursor-default`}>

                                                </p>
                                            </ToolTip>
                                        )
                                    })}
                                    <p className="text-xs text-subtext3 text-center w-[15px]">
                                        {16 - i}
                                    </p>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="m-5 mx-7 flex flex-col gap-2 w-[80%] max-w-[600px] bg-panel1 rounded-2xl p-8 " onClick={e => e.stopPropagation()}>
                    <p className="text-lg font-medium mb-2">
                        Calendar Info
                    </p>
                    <div className="max-h-[50dvh] overflow-y-scroll no-scrollbar">
                        <p className="text-subtext2 text-sm text-justify">
                            The calendar shows completions from the past 16 weeks with the current week being on the right
                            and the 16th week being on the left.
                        </p>
                        <p className="text-subtext2 text-sm">
                            Each column represents a week starting with Sunday at the top of the column
                        </p>
                        <p className="text-subtext2 text-sm text-justify">
                            Below is a legend for what each symbol represents:
                        </p>

                        <p className="text-subtext1 text-sm text-justify mt-4 font-medium">
                            Color
                        </p>
                        <div className="flex justify-between mt-3 items-start">
                            <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                                <div className="w-4 h-4 bg-highlight  rounded-sm"></div>
                                <p className="text-subtext2 text-xs text-center">
                                    Completion
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                                <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
                                <p className="text-subtext2 text-xs text-center">
                                    Missed Day
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                                <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                                <p className="text-subtext2 text-xs text-center">
                                    Skipped Day
                                </p>
                            </div> 
                            <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                                <div className="w-4 h-4 outline-1 outline-neutral-700 rounded-sm"></div>
                                <p className="text-subtext2 text-xs text-center">
                                    Empty Day
                                </p>
                            </div>
                        </div>
                        <p className="text-subtext1 text-sm text-justify mt-4 font-medium">
                            Shape
                        </p>
                        <div className="flex justify-between mt-3 items-start">
                            <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                                <div className="w-4 h-4 border-1 border-neutral-700 rounded-none"></div>
                                <p className="text-subtext2 text-xs text-center">
                                    Habit creation day
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                                <div className="w-4 h-4 border-1 border-neutral-700 rounded-sm"></div>
                                <p className="text-subtext2 text-xs text-center">
                                    Normal Day
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                                <div className="w-4 h-4  border-1 border-neutral-700  rounded-2xl"></div>
                                <p className="text-subtext2 text-xs text-center">
                                    Today
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                            </div>
                        </div>
                    </div>
                   <ButtonComp
                        name={"Done"}
                        highlight={true}
                        onSubmit={() => setOpen(false)}
                        noAnimation={true}
                        style="mt-6"/>
                </div>
            </Model>
            <Model open={openNotes} onClose={() => {setOpenNotes(false); setNotes([])}}>
                <div className="m-5 mx-7 flex flex-col gap-2 w-[80%] max-w-[600px] bg-panel1 rounded-2xl p-8 " onClick={e => e.stopPropagation()}>
                    <p className="text-lg font-medium mb-2">
                        Notes
                    </p>
                    <div className="max-h-[40dvh] overflow-y-scroll no-scrollbar flex flex-col gap-2">
                       {notes.map(n => {
                            if(n == "") return
                            return(
                                <p className="text-subtext2 text-sm  border-1 px-3 py-2 border-border2 rounded-xl bg-panel2 hover:cursor-default hover:scale-98 transition-transform duration-150 ease-in-out">
                                    {n}
                                </p>
                            )
                       })}
                    </div>
                   <ButtonComp
                        name={"Done"}
                        highlight={true}
                        onSubmit={() => setOpenNotes(false)}
                        noAnimation={true}
                        style="mt-4"/>
                </div>
            </Model>
        </div>
    )
}

function getDayStatus(day: HabitUtil.compDaysType){
    return day.skip ? "Skipped" : day.done ? "Completed" : day.complete ? "Missed" : "No Entries"
}