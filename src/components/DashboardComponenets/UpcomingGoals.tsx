import { useContext, useState, useEffect, useMemo } from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { dateUtils } from "@/utils/dateUtils"
import { FaHourglassHalf } from "react-icons/fa"
import { HabitUtil } from "@/utils/HabitUtil"
import { useNavigate } from "react-router-dom"
import { TbTargetArrow } from "react-icons/tb";
import { TbCalendarCheck } from "react-icons/tb";


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
            setTimeLeft(times);
        }

        calcTime()
        const intervalID = setInterval(calcTime, 1000);

        return () => clearInterval(intervalID);
    }, [goals]);

    function getUpcomingGoals(amount: number){
        return goals
            .sort((a, b) => a.completionDate - b.completionDate)
            .filter(g => (Number(g.completionDate) >= new Date().getTime()) && !g.completed)
            .slice(0, amount)
    }

    return (
        <div className="flex flex-col gap-3 m-7 mb-0 ">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-panel2 text-subtext2 outline-1 outline-border2 p-1.5 rounded-lg">
                        <TbTargetArrow />
                    </div>
                    <p className="text-lg text-title font-semibold leading-none pb-1">
                        Upcomming Goals
                    </p>
                </div>
                {HC.isCalculating.current.isLoading() ? 
                <div>
                    <p className="text-xs text-subtext2 animate-pulse">
                        Fteching you're upcomming goals…
                    </p>
                </div> :
                <div className="w-full flex flex-col gap-2">
                    {upcommingGoals.length == 0 ?
                    <p className="text-subtext2 text-xs">
                        No upcomming goals, try and create a new goal
                    </p>:
                    upcommingGoals.map((g, i) => {
                        return(
                            <div className={`bg-panel2 px-2 rounded-xl border-1 border-border2 hover:cursor-pointer hover:scale-101 transition-all duration-150 ease-in-out text-sm  py-2  flex justify-between items-center gap-2`} key={i}
                                onClick={() => {
                                    HC.setCurrentGoal(g)
                                    navigate("/goals")
                                }}>
                                <p className="text-subtext1 truncate overflow-hidden whitespace-nowrap">
                                    🎯 {Util.capitilizeFirst(g.name)}
                                </p>
                                <p className="text-subtext3 text-xs flex items-center gap-1 whitespace-nowrap">
                                  <FaHourglassHalf size={9} className="mt-[1px]"/> {dateUtils.formatTime(timeLeft[i], true)}
                                </p>
                            </div>
                        )
                    })
                    }
                </div>
                }
            </div>
            <div className="mt-3 flex flex-col gap-3">
                <div className="flex items-center gap-4 mb-2 mt-2">
                    <div className="bg-panel2 text-subtext2 outline-1 outline-border2 p-1.5 rounded-lg">
                        <TbCalendarCheck className=""/>
                    </div>
                    <p className="text-lg text-title font-semibold leading-none pb-1">
                        Today's Habits
                    </p>
                </div>
                {HC.isCalculating.current.isLoading() ? 
                <div>
                    <p className="text-xs text-subtext2 animate-pulse">
                        Analyzing your progress today…
                    </p>
                </div>
                : tasksToday.length == 0 ? 
                Util.fetchAllMapItems(HC.habits).length == 0 ?
                 <div className="h-10 flex items-center">
                    <p className="text-subtext2 text-xs ">
                        No habits, Try creating one
                    </p>
                </div>
                :
                <div className="h-10 flex items-center">
                    <p className="text-subtext2 text-sm">
                        🎉 Congratulations! You've completed all your habits for today — well done! 🎉
                    </p>
                </div>:
                <div className="w-full max-h-36 overflow-y-scroll no-scrollbar flex flex-col gap-2  p-[1px] justify-stretch items-center">
                    {tasksToday.map((t, _) => {
                        return(
                            <>
                                <div className={`bg-panel2 px-2 rounded-xl border-1 hover:scale-101 transition-all duration-150 ease-in-out flex justify-between  items-center py-2 pb-3  border-border2 w-full outline-border2   hover:cursor-pointer`}
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
