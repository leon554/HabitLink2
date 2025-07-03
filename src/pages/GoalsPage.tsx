import { useContext} from "react"
import { UserContext } from "../components/Providers/UserProvider"
import GoalProgress from "../components/goalComponenets/GoalProgress"
import CountDown from "../components/goalComponenets/CountDown"
import AssociatedHabits from "../components/goalComponenets/AssociatedHabits"
import AvgConsistency from "../components/goalComponenets/AvgConsistency"
import { Util } from "../utils/util"
import { HabitTypeE} from "../utils/types"
import useCurrentGoalValue from "../components/Hooks/useCurrentGoalValue"
import GoalTitlePanel from "@/components/goalComponenets/GoalTitlePanel"
import GoalCompletionPanel from "@/components/goalComponenets/GoalCompletionPanel"
import AvgStrengthPanel from "../AvgStrengthPanel"
import GoalSummary from "@/components/goalComponenets/GoalSummary"


export default function GoalsPage() {

    const HC = useContext(UserContext)
    const startValue = HC.currentGaol?.startValue ?? 0
    const currenValue = useCurrentGoalValue()
    const targetValue = HC.currentGaol?.targetValue ?? 0
    const isGoalFinished =  Util.calculateProgress(startValue, currenValue, targetValue) >= 1;


    return (
        <div className="w-full flex justify-center mb-10 ">
            {!HC.currentGaol ?
                <div className="w-[90%] max-w-[600px] mt-20 bg-stone-800 text-stone-300  rounded-2xl p-4 flex justify-center flex-col items-center">
                    <p className="text-2xl mb-5 mt-1">
                        Select Goal
                    </p>
                    <div className="flex flex-col items-stretch gap-2 w-full mb-2">
                        {Array.from(HC.goals.values()).map((g, i) => {
                            return(
                                <div key={i} className="grow-1 bg-stone-700/30 rounded-2xl text-stone-300 flex gap-3 items-center hover:cursor-pointer"
                                    onClick={() => HC.setCurrentGoal(g)}>
                                    <div className="w-3 h-10 bg-green-400 rounded-l-md"></div>
                                    <p>{g.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            :
            <div className="w-full flex flex-col items-center gap-3">
                <GoalTitlePanel/> 
                {!isGoalFinished? 
                    <CountDown/> :
                    <GoalCompletionPanel/>
                }
                <div className="w-[90%] max-w-[600px] p-7 bg-panel1 rounded-2xl outline-1 outline-border flex flex-col gap-4">
                    {HC.currentGaol.type == HabitTypeE.Normal && HC.currentGaol.linkedHabit ===  null? 
                        "" : 
                        <GoalProgress/>
                    }
                    <AvgConsistency/>
                    <AvgStrengthPanel/>
                </div>
                <GoalSummary/>
                <AssociatedHabits/>
            </div>}
        </div>
    )
}
