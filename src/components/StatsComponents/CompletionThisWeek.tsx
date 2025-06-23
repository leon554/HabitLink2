import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "../../utils/HabitUtil"


export default function CompletionThisWeek() {

    const HC = useContext(UserContext)

    const currentHabitCompletions = HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined
    const compDays = HabitUtil.getCompletionDaysThisWeek(HC.currentHabit, currentHabitCompletions)

    return (
        <div className="w-full bg-panel1 rounded-2xl outline-1 outline-border font-mono text-title justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4">
            <div className="w-full">
                <p className="text-lg text-center">
                    Completions This Week
                </p>
            </div>
            <div className="flex gap-3 justify-around w-full max-w-[400px]">
                {compDays.map((d, i) => {
                    return(
                        <div key={i}>
                            <p className={` ${d.done ? "bg-btn text-btn-text outline-1 outline-border2 dark:outline-0" : d.complete ? "bg-panel2 outline-1 outline-border2 text-subtext2" : "text-subtext2 outline-1 outline-border2"} p-1 rounded-xl px-3`}>
                                {d.day.toUpperCase()}
                            </p>
                        </div>
                    )
                })}
            </div>
            <div>
                <p className="text-subtext3 text-xs">
                    Due: {HabitUtil.getCompletionDaysString(HC.currentHabit?.completionDays ?? "")}
                </p>
            </div>
        </div>
    )
}
