import { useContext, useState, useEffect } from "react"
import InfoBox from "../StatsComponents/InfoBox"
import { type HabitType } from "@/utils/types"
import { UserContext} from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import useCurrentGoalValue from "../Hooks/useCurrentGoalValue"
import { HabitTypeE } from "@/utils/types"
import { TbChartCandle } from "react-icons/tb";




export default function GoalSummary() {

    const HC = useContext(UserContext)

    const associatedHabitIds = HC.getCurrentGoal()?.habits.split(",").map(i => Number(i)) ?? []
    const habits = Util.fetchMapItems<HabitType>(associatedHabitIds, HC.habits)
    const concistencies = (HC.goalStats.get(HC.getCurrentGoal()?.id!) ?? []).map(s => s.consistency).filter(n => !isNaN(n))
    const strengths = (HC.goalStats.get(HC.getCurrentGoal()?.id!) ?? []).map(s => Math.round(s.strength)).filter(n => !isNaN(n))
    
    const [timeLeft, setTimeLeft] = useState((HC.getCurrentGoal()?.completionDate ?? 0) - Date.now());
    const completionTime = HC.getCurrentGoal()?.completionDate ?? 0
    const startValue = HC.getCurrentGoal()?.startValue ?? 0
    let currentValue = useCurrentGoalValue()
    const targetValue = HC.getCurrentGoal()?.targetValue ?? 0
    const startTime = new Date(HC.getCurrentGoal()!.created_at).getTime()

    const progress = Util.calculateProgress(startValue, currentValue, targetValue)*100
    const timeProgress = (1 - (timeLeft)/(completionTime - startTime)) * 100
    const onTrack = (progress >= timeProgress) ? "Yes" : HC.getCurrentGoal()?.type == HabitTypeE.Normal && HC.getCurrentGoal()?.linkedHabit == null ? "Yes" :  "No"

    useEffect(() => {
        function calcTime(){
            setTimeLeft(completionTime - Date.now());
        }

        calcTime()
        const intervalID = setInterval(calcTime, 1000);

        return () => clearInterval(intervalID);
    }, [HC.getCurrentGoal()]);

    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none w-[90%] max-w-[600px] relative bg-panel1 rounded-2xl font outline-1 outline-border text-title justify-center p-7 py-5 pb-7 flex flex-col items-center gap-4">
            <div className="w-full">
                <div className="flex items-center gap-3 mb-1 mt-1">
                    <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                        <TbChartCandle />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-title font-semibold leading-none pb-1">
                            Progression
                        </p>
                    </div>
                </div>
            </div>
            <div className="gap-3 gap-x-14 grid-cols-2 max-sm:grid-cols-1 grid  items-stretch w-full">
                <InfoBox addPercent={false} value={String(habits.length)} text="Associated Habits" toolTipText="The number of habits associated to this goal. All associated habits are used for the data displayed for this goal"/>
                <InfoBox addPercent={false} value={onTrack} text="On Track" toolTipText="This indicator shows whether you're on track to complete your goal. It is calculated by comparing your time progress with your actual progress. If your actual progress is greater than your time progress, the result is 'Yes', meaning you're on track. Both values can be viewed at the top of the page."/>
                <InfoBox addPercent={true} value={String(Math.max(...concistencies)) } text="Max Consistency" toolTipText="This is the highest consistency of all your associated habits"/>
                <InfoBox addPercent={true} value={String(Math.min(...concistencies)) } text="Min Consistency" toolTipText="This is the lowest consistency of all your associated habits"/>
                <InfoBox addPercent={true} value={String(Math.max(...strengths)) } text="Max Strength" toolTipText="This is the highest strength of all your associated habits"/>
                <InfoBox addPercent={true} value={String(Math.min(...strengths)) } text="Min Strength" toolTipText="This is the lowest consistency of all your associated habits"/>
            </div>
        </div>
    )
}
