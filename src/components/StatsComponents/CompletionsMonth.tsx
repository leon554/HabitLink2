import { useContext, useState } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "../../utils/HabitUtil"
import { dateUtils } from "../../utils/dateUtils"
import { IoInformationCircleOutline } from "react-icons/io5";
import Model from "../InputComponents/Model";

export default function CompletionsMonth() {
    const HC = useContext(UserContext)
    const [open, setOpen] = useState(false)

    const currentHabitCompletions = HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined
    const compDays = HabitUtil.getCompletionDaysThisPeriod(HC.currentHabit, currentHabitCompletions)
    const days = ["S", "M", "T", "W", "T", "F", "S"]

    return (
        <div className="w-full bg-panel1  rounded-2xl outline-1 outline-border font-mono relative text-title justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4">
            <div className="w-full flex justify-center items-center">
                <p className="text-lg text-center">
                    Completions Past 16 Weeks
                </p>
            </div>
            <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer absolute top-3 right-3" onClick={() => {
                setOpen(true)
            }}/>
            <div className="w-full">
                <div className=" w-full mr-1.5 flex gap-1.5  justify-center">
                    <div className="flex flex-col gap-1.5 mr-0.5 ">
                        {Array(7).fill(null).map((_, i) => {
                            return(
                                <p className="h-4 flex items-center text-xs text-subtext3">
                                    {days[i]}
                                </p>
                            )
                        })}  
                    </div>
                    {compDays.map((d, i) => {
                        return(
                            <div key={i} className="flex flex-col items-center gap-1.5">
                                {d.reverse().map(v => {
                                    return(
                                        <p className={`w-4 h-4 ${dateUtils.isDatesSameDay(v.day , new Date()) ? 
                                            v.done ? "bg-highlight rounded-xl" : "outline-1 outline-highlight rounded-sm" :
                                            v.habitCreation ? 
                                            v.done ? 
                                            "rounded-none bg-highlight" :
                                            v.complete ? 
                                            "rounded-none bg-red-400" :
                                            "outline-1 rounded-none outline-green-500" : 
                                            v.done ?
                                            "bg-highlight rounded-sm" : 
                                            v.complete ? 
                                            "bg-red-400 rounded-sm" : 
                                            "outline-1 outline-border2/70 rounded-sm"}`}>

                                        </p>
                                    )
                                })}
                                <p className="text-xs text-subtext3 text-center w-[15px]">
                                    {16 - i}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="m-5 mx-7 flex flex-col gap-2 w-[80%] max-w-[600px] bg-panel1 rounded-2xl p-8">
                    <p className="text-lg">
                        Calander Info
                    </p>
                    <p className="text-subtext2 text-sm text-justify">
                        The calander shows completions from the past 16 weeks with the current week being on the right
                        and the 16th week being on the left.
                    </p>
                    <p className="text-subtext2 text-sm">
                        Each column represents a week starting with Sunday at the top of the column
                    </p>
                    <p className="text-subtext2 text-sm text-justify">
                        Below is a legend for what each symbol represents:
                    </p>
                    <div className="flex justify-between mt-5 items-start">
                        <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                            <div className="w-4 h-4 outline-1 outline-highlight rounded-sm"></div>
                            <p className="text-subtext2 text-xs text-center">
                                Today without completion
                            </p>
                        </div>
                         <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                            <div className="w-4 h-4 bg-highlight rounded-full"></div>
                            <p className="text-subtext2 text-xs text-center">
                                Today with completion
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                            <div className="w-4 h-4 bg-highlight rounded-sm"></div>
                            <p className="text-subtext2 text-xs text-center">
                                Completed Day
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                            <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
                            <p className="text-subtext2 text-xs text-center">
                                Missed Day
                            </p>
                        </div> 
                    </div>
                    <div className="flex justify-between mt-5 items-start">
                        <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                            <div className="w-4 h-4 border-1 border-highlight rounded-none"></div>
                            <p className="text-subtext2 text-xs text-center">
                                Habit creation day
                            </p>
                        </div>
                         <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                            <div className="w-4 h-4 bg-highlight "></div>
                            <p className="text-subtext2 text-xs text-center">
                                Habit creation day with completion
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                            <div className="w-4 h-4 bg-red-400"></div>
                            <p className="text-subtext2 text-xs text-center">
                                Habit creation day with missed completion
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1.5 w-12">
                            <div className="w-4 h-4 outline-1 outline-stone-700 rounded-sm"></div>
                            <p className="text-subtext2 text-xs text-center">
                                Empty day
                            </p>
                        </div> 
                    </div>
                    <button className="bg-btn rounded-xl text-btn-text font-mono py-1 mt-5 hover:cursor-pointer"
                        onClick={() => setOpen(false)}>
                        Done
                    </button>
                </div>
            </Model>
        </div>
    )
}
