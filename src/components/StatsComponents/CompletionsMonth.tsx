import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "../../utils/HabitUtil"

export default function CompletionsMonth() {
const HC = useContext(UserContext)

    const currentHabitCompletions = HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined
    const compDays = HabitUtil.getCompletionDaysThisPeriod(HC.currentHabit, currentHabitCompletions)

    return (
        <div className="w-full bg-stone-800 rounded-md font-mono text-stone-300 justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4">
            <div className="w-full">
                <p className="text-lg text-center">
                    Completions Past 16 Weeks
                </p>
            </div>
            <div className="grid grid-flow-col grid-rows-7 grid-cols-16 gap-1 w-full max-w-[400px]">
                {compDays.map((d, i) => {
                    return(
                        <div key={i}>
                            <p className={` ${d.done ? "bg-green-400 text-stone-900" : d.complete ? "text-stone-400 bg-red-400" : "text-stone-400 outline-1 outline-stone-700"} p-1 rounded-sm w-4 h-4`}>
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
