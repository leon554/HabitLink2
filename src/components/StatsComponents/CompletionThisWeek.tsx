import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "../../utils/HabitUtil"


export default function CompletionThisWeek() {

    const HC = useContext(UserContext)

    const currentHabitCompletions = HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined
    const compDays = HabitUtil.getCompletionDaysThisWeek(HC.currentHabit, currentHabitCompletions)

    return (
        <div className="w-full bg-stone-800 rounded-md font-mono text-stone-300 justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4">
            <div className="w-full">
                <p className="text-lg text-center">
                    Completions This Week
                </p>
            </div>
            <div className="flex gap-3 justify-around w-full max-w-[400px]">
                {compDays.map((d, i) => {
                    return(
                        <div key={i}>
                            <p className={` ${d.done ? "bg-green-400 text-stone-900" : d.complete ? "bg-stone-700 text-stone-400" : "text-stone-400 outline-1 outline-stone-700"} p-1 rounded-md px-3`}>
                                {d.day.toUpperCase()}
                            </p>
                        </div>
                    )
                })}
            </div>
            <div>
                <p className="text-stone-500 text-xs">
                    Due: {HabitUtil.getCompletionDaysString(HC.currentHabit?.completionDays ?? "")}
                </p>
            </div>
        </div>
    )
}
