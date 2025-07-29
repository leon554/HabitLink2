import { useContext, useState, useEffect } from "react"
import InfoBox from "../StatsComponents/InfoBox"
import { type HabitType } from "@/utils/types"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import useCurrentGoalValue from "../Hooks/useCurrentGoalValue"
import { HabitTypeE } from "@/utils/types"




export default function GoalSummary() {

    const HC = useContext(UserContext)

    const associatedHabitIds = HC.currentGaol?.habits.split(",").map(i => Number(i)) ?? []
    const habits = Util.fetchMapItems<HabitType>(associatedHabitIds, HC.habits)
    const concistencies = Util.fetchMapItems<number>(associatedHabitIds, HC.habitComps).map(c => Math.round(c*100))
    const strengths = Util.fetchMapItems<number>(associatedHabitIds, HC.habitStrengths).map(c => Math.round(c))
    
    const [timeLeft, setTimeLeft] = useState((HC.currentGaol?.completionDate ?? 0) - Date.now());
    const completionTime = HC.currentGaol?.completionDate ?? 0
    const startValue = HC.currentGaol?.startValue ?? 0
    let currentValue = useCurrentGoalValue()
    const targetValue = HC.currentGaol?.targetValue ?? 0
    const startTime = new Date(HC.currentGaol!.created_at).getTime()

    const progress = Util.calculateProgress(startValue, currentValue, targetValue)*100
    const timeProgress = (1 - (timeLeft)/(completionTime - startTime)) * 100
    const onTrack = (progress >= timeProgress) ? "Yes" : HC.currentGaol?.type == HabitTypeE.Normal && HC.currentGaol.linkedHabit == null ? "Yes" :  "No"

    useEffect(() => {
        function calcTime(){
            setTimeLeft(completionTime - Date.now());
        }

        calcTime()
        const intervalID = setInterval(calcTime, 1000);

        return () => clearInterval(intervalID);
    }, [HC.currentGaol]);

    return (
        <div className="w-[90%] max-w-[600px] relative bg-panel1 rounded-2xl font outline-1 font-mono outline-border text-title justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4">
            <div className="w-full">
                <p className="text-lg text-leftr mt-1 font-sans font-medium">
                    Overview
                </p>
            </div>
            <div className="gap-3 gap-x-14 grid-cols-2 grid  items-stretch w-full">
                <InfoBox value={String(habits.length)} text="Associated Habits" toolTipText="The number of habits associated to this goal. All associated habits are used for the data displayed for this goal"/>
                <InfoBox value={onTrack} text="On Track" toolTipText="This indicator shows whether you're on track to complete your goal. It is calculated by comparing your time progress with your actual progress. If your actual progress is greater than your time progress, the result is 'Yes', meaning you're on track. Both values can be viewed at the top of the page."/>
                <InfoBox value={String(Math.max(...concistencies)) + "%"} text="Max Consistency" toolTipText="This is the highest concistency of all your associated habits"/>
                <InfoBox value={String(Math.min(...concistencies)) + "%"} text="Min Consistency" toolTipText="This is the lowest concistency of all your associated habits"/>
                <InfoBox value={String(Math.max(...strengths))} text="Max Strength" toolTipText="This is the highest strength of all your associated habits"/>
                <InfoBox value={String(Math.min(...strengths))} text="Min Strength" toolTipText="This is the lowest concistency of all your associated habits"/>
            </div>
        </div>
    )
}
