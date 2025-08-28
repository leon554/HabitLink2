import { useContext, useEffect, useState} from "react"
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
import ToolTip from "@/components/ToolTip"
import { AuthContext } from "@/components/Providers/AuthProvider"
import { AiOutlineLoading } from "react-icons/ai"
import { triggerHaptic } from "tactus"
import LogChart from "@/components/goalComponenets/LogChart"
import { TbGauge } from "react-icons/tb"
import ButtonComp from "@/components/primatives/ButtonComp"
import ProgressBar from "@/components/InputComponents/ProgressBar"


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

    const [timeLeft, setTimeLeft] = useState(Array.from(HC.goals.values())
        .filter(v => !v.archived)
        .map(v => {
            return (v.completionDate ?? 0) - Date.now()
        })
    );
    const startTime = Array.from(HC.goals.values()).map(g => new Date(g.created_at).getTime())
    const completionTime = Array.from(HC.goals.values()).map(g => g.completionDate)

    useEffect(() => {
        if(HC.goals.size == 0) return 

        if(timeLeft.length == 0){
            setTimeLeft(Array.from(HC.goals.values())
            .filter(v => !v.archived)
            .map(v => {
                return (v.completionDate ?? 0) - Date.now()
            }))
        }

        function calcTime(){
            setTimeLeft(prev =>
                prev.map((_, i) => (completionTime[i] ?? 0) - Date.now())
            );
        }
        calcTime()
        const intervalID = setInterval(calcTime, 1000);

        return () => {
            clearInterval(intervalID);
        }
    }, [HC.currentGaol, HC.goals]);



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
                    <div className="shadow-md shadow-gray-200 dark:shadow-none w-[90%] max-w-[600px] mt-20 bg-panel1 text-title  rounded-2xl p-4 outline-1 outline-border flex justify-center flex-col items-center">
                        <p className="text-2xl font-medium">
                            Select Goal
                        </p>
                    </div>
                    <div className="flex flex-col  items-stretch gap-2.5 mb-2 w-[90%] max-w-[600px]">
                        {Array.from(HC.goals.values()).filter(g => !g.archived).map((g, i) => {
                            return(
                                <div key={i} className={`hover:cursor-pointer gap-7 shadow-md shadow-gray-200 dark:shadow-none grow-1 bg-panel1 rounded-2xl outline-1 outline-border p-3.5 items-center flex justify-between`}
                                    onClick={() => {
                                        triggerHaptic()
                                        HC.setCurrentGoal(g.id)
                                    }}>
                                    <p className="text-subtext2 font-medium truncate overflow-hidden whitespace-nowrap w-[55%]">
                                        🎯 {g.name}
                                    </p>
                                    <div className="hover:cursor-pointer w-[23%] ">
                                        <ToolTip tooltip={
                                            <div className="bg-panel1 rounded-2xl outline-1 outline-border p-3 flex flex-col items-center gap-2">
                                                <p className="text-xs text-center text-subtext2 whitespace-nowrap">
                                                    Goal Time Progress
                                                </p>
                                                <p className="text-sm font-medium text-subtext2">
                                                    {Math.round((1 - (timeLeft[i])/(completionTime[i] - startTime[i])) * 100*1000)/1000}%
                                                </p>
                                                <p className="text-xs text-center text-subtext2 whitespace-nowrap">
                                                    Goal Progress
                                                </p>
                                                <p className="text-sm font-medium text-subtext2">
                                                    {Math.round(HC.goalProgress.get(g.id) ?? 0)}%
                                                </p>
                                            </div>
                                        }>
                                            <div className="w-full flex flex-col gap-2">
                                                {Math.round(HC.goalProgress.get(g.id) ?? 0) >= 100 ? 
                                                <div className="flex items-center gap-2 justify-center outline-1 py-2 rounded-lg outline-highlight/30">
                                                    <p className="text-sm  text-highlight flex items-center gap-3">
                                                        Completed 🎉
                                                    </p>
                                                    
                                                </div> :
                                                <>
                                                    <div className="flex w-full  items-center gap-5">
                                                        <p className="text-sm w-3">
                                                            ⏰
                                                        </p>
                                                        <div className="w-full">
                                                            <ProgressBar min={0} max={100} current={(1 - (timeLeft[i])/(completionTime[i] - startTime[i])) * 100} height={7}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full  items-center gap-5">
                                                        <p className="text-sm w-3">
                                                            📊
                                                        </p>
                                                        <div className="w-full">
                                                            <ProgressBar min={0} max={100} current={Math.round(HC.goalProgress.get(g.id) ?? 0)} height={7}/>
                                                        </div>
                                                    </div>
                                                </>
                                                }
                                            </div>
                                        </ToolTip>
                                    </div>
                                </div>
                            )
                        })}
                        {Array.from(HC.goals.values()).some(g => g.archived) ? 
                        <div className=" max-w-[600px] bg-panel1 w-full rounded-2xl p-5  outline-1 outline-border">
                            <p className="text-subtext1 font-medium">
                                Archived Goals
                            </p>
                            <div className="mt-3 flex  flex-wrap gap-3">
                                {Array.from(HC.goals.values()).filter(g => g.archived).map(g => {
                                    return(
                                        <div className="outline-1 outline-border2 rounded-md p-1.5 px-2 hover:cursor-pointer hover:bg-panel2 transition-all duration-200 ease-in-out"
                                            onClick={() => HC.setCurrentGoal(g.id)}>
                                            <p className="text-xs font-medium text-subtext2">
                                                {g.name}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        : null}
                    </div>
                </div>
            : HC.isCalculating.current.isLoading() || auth.loading ?
            <AiOutlineLoading className="animate-spin text-subtext1 mt-25" size={30}/> :
            Util.fetchAllMapItems(HC.goals).length == 0 ? 
                <div className="shadow-md shadow-gray-200 dark:shadow-none w-[90%] max-w-[400px] bg-panel1 rounded-2xl outline-1 outline-border  p-7 flex flex-col gap-4 mt-18">
                    <p className="text-lg text-title font-medium leading-none">
                        No Goals :(
                    </p>
                    <p className="text-sm text-subtext3">
                        You currently have no goals, try adding a new goal and then coming back 💪
                    </p>
                    <div className="flex gap-3 w-full">
                        <ButtonComp
                            name={"New Goal"}
                            highlight={true}
                            onSubmit={() => {
                                navigate("/creategoal")
                            }}
                            short={true}
                            style="w-full"/>
                        <ButtonComp
                            name={"Learn More"}
                            highlight={false}
                            onSubmit={() => {
                                navigate("/help")
                            }}
                            short={true}
                            style="w-full"/>
                    </div>

                </div>        
            :
            <div className="w-full flex flex-col items-center gap-3">
                <GoalTitlePanel/> 
                {!isGoalFinished? 
                    <CountDown/> :
                    <GoalCompletionPanel/>
                }
                <div className="shadow-md shadow-gray-200 dark:shadow-none w-[90%] max-w-[600px] p-7 py-5 pb-7 bg-panel1 rounded-2xl outline-1 outline-border flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2 mt-1">
                        <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
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
