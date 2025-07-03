import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "../../utils/HabitUtil"
import { useScreenWidth } from "../Hooks/UseScreenWidth"


export default function CompletionThisWeek() {

    const HC = useContext(UserContext)
    const width = useScreenWidth()

    const currentHabitCompletions = HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined
    const compDays = HabitUtil.getCompletionDaysThisWeek(HC.currentHabit, currentHabitCompletions)

    return (
        <div className="w-full bg-panel1 rounded-2xl outline-1 outline-border  text-title justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4 ">
            <div className="w-full">
                <p className=" text-left mt-1">
                    Completions This Week
                </p>
                <p className="text-subtext3 text-xs mb-1.5 mt-0.5">
                    Due: {HabitUtil.getCompletionDaysString(HC.currentHabit?.completionDays ?? "")}
                </p>
            </div>
            <div className={`flex gap-3 justify-between w-full ${width < 600 ? "max-w-[400px]" : "max-w-[550px]"}`} >
                {compDays.map((d, i) => {
                    return(
                        <div key={i} className="hover:scale-[1.05] transition-transform duration-200 hover:cursor-default">
                            <p className={` ${d.done ? "bg-btn text-btn-text outline-1 outline-border2 dark:outline-0" : d.complete ? "bg-panel2 outline-1 outline-border2 text-subtext2" : "text-subtext2 outline-1 outline-border2"} p-1 rounded-xl px-3 ${width < 600 ? "" : "px-4"}`}>
                                {width < 600 ? d.day.toUpperCase().slice(0, 1) :  d.day.toUpperCase()}
                            </p>
                        </div>
                    )
                })}
            </div>
        
        </div>
    )
}
