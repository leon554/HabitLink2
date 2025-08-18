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
import { HabitTypeE, type GoalType } from "@/utils/types"
import { useNavigate } from "react-router-dom"
import FullCircleProgressBar from "@/components/InputComponents/FullCircleProgressBar"
import ToolTip from "@/components/ToolTip"
import { AuthContext } from "@/components/Providers/AuthProvider"
import { AiOutlineLoading } from "react-icons/ai"
import { triggerHaptic } from "tactus"
import LogChart from "@/components/goalComponenets/LogChart"
import { TbGauge } from "react-icons/tb"


export default function GoalsPage() {

    const HC = useContext(UserContext)
    const auth = useContext(AuthContext)
    const startValue = HC.getCurrentGoal()?.startValue ?? 0
    const currenValue = useCurrentGoalValue()
    const targetValue = HC.getCurrentGoal()?.targetValue ?? 0
    const progress = Util.calculateProgress(startValue, currenValue, targetValue)
    const isGoalFinished =   progress >= 1;
    const goal = HC.getCurrentGoal()
    const navigate = useNavigate()

    useEffect(() => {
        const updateGoal = async () => {
            if(isGoalFinished && !HC.getCurrentGoal()?.completed){
                await HC.compleGoal(HC.getCurrentGoal()?.id!)
                const updatedGoals = Util.updateMap(HC.goals, HC.currentGaol!, {...HC.getCurrentGoal(), completed: true} as GoalType)
                HC.setGaols(updatedGoals)
                const newGoalMap = Util.updateMap<number, GoalType>(HC.goals, HC.getCurrentGoal()!.id, {...HC.getCurrentGoal(), completed: true} as GoalType)
                HC.setGaols(newGoalMap)
            }
        }
        updateGoal()
    }, [isGoalFinished])

     useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="w-full flex justify-center mb-10 ">
            {!HC.getCurrentGoal() && Util.fetchAllMapItems(HC.goals).length != 0 ?
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
                                    onClick={() => {
                                        triggerHaptic()
                                        HC.setCurrentGoal(g.id)
                                    }}>
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
            : HC.isCalculating.current.isLoading() || auth.loading ?
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
                        onClick={() => {
                            triggerHaptic()
                            navigate("/creategoal")
                        }}>
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
                <div className="w-[90%] max-w-[600px] p-7 py-5 pb-7 bg-panel1 rounded-2xl outline-1 outline-border flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2 mt-1">
                        <div className="bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                            <TbGauge />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-title font-semibold leading-none pb-1">
                                Progression
                            </p>
                        </div>
                    </div>
                    <AvgConsistency/>
                    <AvgStrengthPanel/>
                </div>
                <GoalSummary/>
                {goal?.type != HabitTypeE.Normal && goal?.linkedHabit == null ?
                    <LogChart/> : null
                }
                <AssociatedHabits/>
                <GoalEdit/>
            </div>}
        </div>
    )
}
