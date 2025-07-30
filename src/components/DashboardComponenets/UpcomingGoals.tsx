import { useContext, useState, useEffect, useMemo } from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { dateUtils } from "@/utils/dateUtils"


export default function UpcomingGoals() {

    const HC = useContext(UserContext)
    const goals = useMemo(() => Util.fetchAllMapItems(HC.goals), [HC.goals]) 
    const upcommingGoals = getUpcomingGoals(2)


    const [timeLeft, setTimeLeft] = useState<number[]>([10,10]);


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
                                {Util.capitilizeFirst(g.name)}
                            </p>
                            <p className="text-subtext2 text-xs">
                                {dateUtils.formatTime(timeLeft[i])}
                            </p>
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}
