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
import FullCircleProgressBar from "@/components/InputComponents/FullCircleProgressBar"
import ToolTip from "@/components/ToolTip"
import { AuthContext } from "@/components/Providers/AuthProvider"
import { AiOutlineLoading } from "react-icons/ai"


export default function GoalsPage() {

    const HC = useContext(UserContext)
    const auth = useContext(AuthContext)
    const startValue = HC.currentGaol?.startValue ?? 0
    const currenValue = useCurrentGoalValue()
    const targetValue = HC.currentGaol?.targetValue ?? 0
    const progress = Util.calculateProgress(startValue, currenValue, targetValue)
    const isGoalFinished =   progress >= 1;
    const navigate = useNavigate()

    useEffect(() => {
        const updateGoal = async () => {
            if(isGoalFinished){
                await HC.compleGoal(HC.currentGaol?.id!)
                HC.setCurrentGoal({...HC.currentGaol, completed: true} as GoalType)
                const newGoalMap = Util.updateMap<number, GoalType>(HC.goals, HC.currentGaol!.id, {...HC.currentGaol, completed: true} as GoalType)
                HC.setGaols(newGoalMap)
            }
        }
        updateGoal()
    }, [isGoalFinished])

    return (
        <div className="w-full flex justify-center mb-10 ">
            {!HC.currentGaol && Util.fetchAllMapItems(HC.goals).length != 0 ?
                <div className="w-full flex flex-col items-center gap-2.5">
                    <div className="w-[90%] max-w-[600px] mt-20 bg-panel1 text-title  rounded-2xl p-4 outline-1 outline-border flex justify-center flex-col items-center">
                        <p className="text-2xl font-medium">
                            Select Goal
                        </p>
                    </div>
                    <div className="flex flex-col items-stretch gap-2.5 mb-2 w-[90%] max-w-[600px]">
                        {Array.from(HC.goals.values()).map((g, i) => {
                            return(
                                <div key={i} className="grow-1 bg-panel1 rounded-2xl outline-1 outline-border p-3.5 items-center flex justify-between"
                                    onClick={() => HC.setCurrentGoal(g)}>
                                    <p className="text-subtext2 font-medium truncate overflow-hidden whitespace-nowrap">
                                        🎯 {g.name}
                                    </p>
                                    <div className="hover:cursor-pointer">
                                        <ToolTip tooltip={
                                            <div className="bg-panel1 rounded-2xl outline-1 outline-border p-2 flex flex-col items-center gap-2">
                                                <p className="text-xs text-center text-subtext2">
                                                    Progress Of Goal
                                                </p>
                                                <p className="text-sm font-medium text-subtext2">
                                                    {Math.round(HC.goalProgress.get(g.id) ?? 0)}%
                                                </p>
                                            </div>
                                        }>
                                            <FullCircleProgressBar value={Math.round(HC.goalProgress.get(g.id) ?? 0)} size={30} fontsize={0} thickness={4}/>
                                        </ToolTip>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            : HC.loading || auth.loading ?
            <AiOutlineLoading className="animate-spin text-subtext1 mt-25" size={30}/> :
            Util.fetchAllMapItems(HC.goals).length == 0 ? 
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
                <div className="w-[90%] max-w-[600px] p-7 py-5 pb-6 bg-panel1 rounded-2xl outline-1 outline-border flex flex-col gap-4">
                    <p className="text-lg text-title font-medium">
                        Performance
                    </p>
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
