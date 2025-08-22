import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "../../utils/HabitUtil"
import { useScreenWidth } from "../Hooks/UseScreenWidth"
import { Util } from "@/utils/util"
import { TbCalendarCheck } from "react-icons/tb";

export default function CompletionThisWeek() {

    const HC = useContext(UserContext)
    const width = useScreenWidth()

    const currentHabitCompletions = HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined
    const compDays = HabitUtil.getCompletionDaysThisWeek(HC.currentHabit, currentHabitCompletions)

    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none w-full bg-panel1 rounded-2xl outline-1 outline-border  text-title justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4 ">
            <div className={`w-full flex ${width < 450 ? "flex-col" : "justify-between items-center"}`}>
                <div className={`flex items-center gap-4 mb-2`}>
                    <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 text-subtext2 outline-1 outline-border2 p-1.5 rounded-lg">
                        <TbCalendarCheck />
                    </div>
                    <p className="text-title font-semibold leading-none pb-1">
                        Weekly Completions
                    </p>
                </div>
                <p className={`text-subtext3 text-xs mb-2 leading-0 ${width < 450 ? "mt-2" : ""}`}>
                    Due: {HabitUtil.getCompletionDaysString(HC.currentHabit?.completionDays ?? "")}
                </p>
            </div>
            <div className={`flex gap-3 justify-between  w-full`} >
                {compDays.map((d, i) => {
                    return(
                        <div key={i} className="hover:scale-[1.05] transition-transform duration-200 hover:cursor-default flex-grow flex justify-center">
                            <p className={`shadow-md shadow-gray-200 dark:shadow-none w-full text-center ${d.done ? "bg-btn text-btn-text outline-1 outline-border2 dark:outline-0" : d.complete ? "bg-panel2 outline-1 outline-border2 text-subtext2" : "text-subtext2 outline-1 outline-border2"} p-1 rounded-xl`}>
                                {width < 600 ? d.day.toUpperCase().slice(0, 1) :  Util.capitilizeFirst(d.day)}
                            </p>
                        </div>
                    )
                })}
            </div>
        
        </div>
    )
}
