import { useContext, useState, useEffect, useMemo } from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { dateUtils } from "@/utils/dateUtils"
import { FaHourglassHalf } from "react-icons/fa"
import { HabitUtil } from "@/utils/HabitUtil"
import { useNavigate } from "react-router-dom"


export default function UpcomingGoals() {

    const HC = useContext(UserContext)
    const goals = useMemo(() => Util.fetchAllMapItems(HC.goals), [HC.goals]) 
    const upcommingGoals = getUpcomingGoals(2)
    const [timeLeft, setTimeLeft] = useState<number[]>([10,10]);
    const tasksToday = Util.fetchAllMapItems(HC.habits).filter(h => HabitUtil.isCompleteableToday(h, HC.habitsCompletions.get(h.id)))
    const navigate = useNavigate()

    useEffect(() => {
        function calcTime(){
            const times: number[]= []
            upcommingGoals.forEach((g) => {
                times.push(g.completionDate - new Date().getTime())
            })
            console.log(times)
            setTimeLeft(times);
        }

        calcTime()
        const intervalID = setInterval(calcTime, 1000);

        return () => clearInterval(intervalID);
    }, [goals]);

    function getUpcomingGoals(amount: number){
        return goals
            .sort((a, b) => a.completionDate - b.completionDate)
            .filter(g => (g.completionDate > new Date().getTime()) && !g.completed)
            .slice(0, Math.min(amount, goals.length - 1))
    }

    return (
        <div className="flex flex-col gap-3 m-7 mb-0">
            <div className="flex flex-col gap-3">
                <p className="text-lg text-title font-medium">
                    Upcomming Goals
                </p>
                <div className="w-full">
                    {upcommingGoals.length == 0 ?
                    <p className="text-subtext2 text-xs">
                        No upcomming goals, try and create a new goal
                    </p>:
                    upcommingGoals.map((g, i) => {
                        return(
                            <div className={`${i < upcommingGoals.length-1 ? "border-b-1" : ""} text-sm border-border2 py-2 pb-3 flex justify-between items-center`} key={i}>
                                <p className="text-subtext1">
                                    🎯 {Util.capitilizeFirst(g.name)}
                                </p>
                                <p className="text-subtext3 text-xs flex items-center gap-1">
                                  <FaHourglassHalf size={9} className="mt-[1px]"/> {dateUtils.formatTime(timeLeft[i])}
                                </p>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
            <div className="mt-3 flex flex-col gap-3">
                <p className="text-lg text-title font-medium">
                    Habits Due Today
                </p>
                {tasksToday.length == 0 ? 
                <div className="h-10 flex items-center">
                    <p className="text-subtext2 text-sm">
                        🎉 Congratulations! You've completed all your habits for today — well done! 🎉
                    </p>
                </div>:
                <div className="w-full max-h-28 overflow-y-scroll no-scrollbar  p-[1px] justify-stretch items-center">
                    {tasksToday.map((t, i) => {
                        return(
                            <>
                                <div className={`${i < tasksToday.length-1 ? "border-b-1" : ""}  flex justify-between  items-center py-2 pb-3  border-border2 w-full outline-border2   hover:cursor-pointer`}
                                    onClick={() => navigate("/log")}>
                                    <p className="text-subtext1 text-sm">
                                        {t.icon} {Util.capitilizeFirst(t.name)}
                                    </p>
                                    <p className="text-xs text-subtext3">
                                        {HabitUtil.getCompletionDaysString(t.completionDays)}
                                    </p>
                                </div>
                            </>
                        )
                    })}
                </div>
                }
            </div>
        </div>
    )
}
