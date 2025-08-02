import { useContext, useEffect} from "react"
import { UserContext } from "../components/Providers/UserProvider"
import CountDown from "../components/goalComponenets/CountDown"
import AssociatedHabits from "../components/goalComponenets/AssociatedHabits"
import AvgConsistency from "../components/goalComponenets/AvgConsistency"
import { Util } from "../utils/util"
import useCurrentGoalValue from "../components/Hooks/useCurrentGoalValue"
import GoalTitlePanel from "@/components/goalComponenets/GoalTitlePanel"
import GoalCompletionPanel from "@/components/goalComponenets/GoalCompletionPanel"
import AvgStrengthPanel from "../AvgStrengthPanel"
import GoalSummary from "@/components/goalComponenets/GoalSummary"
import GoalEdit from "@/components/goalComponenets/GoalEdit"
import type { GoalType } from "@/utils/types"
import { useNavigate } from "react-router-dom"


export default function GoalsPage() {

    const HC = useContext(UserContext)
    const startValue = HC.currentGaol?.startValue ?? 0
    const currenValue = useCurrentGoalValue()
    const targetValue = HC.currentGaol?.targetValue ?? 0
    const isGoalFinished =  Util.calculateProgress(startValue, currenValue, targetValue) >= 1;
    const navigate = useNavigate()

    useEffect(() => {
        const updateGoal = async () => {
            if(isGoalFinished){
                await HC.compleGoal(HC.currentGaol?.id!)
                HC.setCurrentGoal({...HC.currentGaol, completed: true} as GoalType)
            }
        }
        updateGoal()
    }, [isGoalFinished])

    return (
        <div className="w-full flex justify-center mb-10 ">
            {!HC.currentGaol && Util.fetchAllMapItems(HC.goals).length != 0 ?
                <div className="w-[90%] max-w-[600px] mt-20 bg-panel1 text-title  rounded-2xl p-4 outline-1 outline-border flex justify-center flex-col items-center">
                    <p className="text-2xl mb-5 mt-1 font-medium">
                        Select Goal
                    </p>
                    <div className="flex flex-col items-stretch gap-2 w-full mb-2">
                        {Array.from(HC.goals.values()).map((g, i) => {
                            return(
                                <div key={i} className="grow-1 bg-panel2 rounded-2xl text-stone-300 flex gap-3 items-center hover:cursor-pointer"
                                    onClick={() => HC.setCurrentGoal(g)}>
                                    <div className="w-3 h-10 bg-green-400 rounded-l-2xl"></div>
                                    <p className="text-subtext1 text-sm">{g.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            : Util.fetchAllMapItems(HC.goals).length == 0 ? 
                <div className="w-[90%] max-w-[600px] bg-panel1 rounded-2xl outline-1 outline-border  p-7 flex flex-col gap-4 mt-18">
                    <p className="text-lg text-title font-medium leading-none">
                        No Goals :(
                    </p>
                    <p className="text-sm text-subtext3">
                        You currently have no goals, try adding a new goal and then comming back 💪
                    </p>
                    <button className="w-full bg-btn rounded-xl py-1 text-btn-text font-medium text-sm hover:cursor-pointer" 
                        onClick={() => navigate("/creategoal")}>
                        New Goal
                    </button>
                </div>        
            :
            <div className="w-full flex flex-col items-center gap-3">
                <GoalTitlePanel/> 
                {!isGoalFinished? 
                    <CountDown/> :
                    <GoalCompletionPanel/>
                }
                <div className="w-[90%] max-w-[600px] p-7 bg-panel1 rounded-2xl outline-1 outline-border flex flex-col gap-4">
                    <AvgConsistency/>
                    <AvgStrengthPanel/>
                </div>
                <GoalSummary/>
                <AssociatedHabits/>
                <GoalEdit/>
            </div>}
        </div>
    )
}
