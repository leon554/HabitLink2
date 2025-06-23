import { useContext} from "react"
import { UserContext } from "../components/Providers/UserProvider"
import Select from "../components/InputComponents/Select"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"
import GoalProgress from "../components/goalComponenets/GoalProgress"
import CountDown from "../components/goalComponenets/CountDown"
import AssociatedHabits from "../components/goalComponenets/AssociatedHabits"
import AvgConsistency from "../components/goalComponenets/AvgConsistency"
import { Util } from "../utils/util"
import { HabitTypeE } from "../utils/types"


export default function GoalsPage() {

    const HC = useContext(UserContext)
    const startValue = HC.currentGaol?.startValue ?? 0
    const currenValue = getCurrentValue() ?? startValue
    const targetValue = HC.currentGaol?.targetValue ?? 0
    const isGoalFinished =  Util.calculateProgress(startValue, currenValue, targetValue) >= 1;

    function getCurrentValue(){
        if(!HC.currentGaol?.linkedHabit){
            return HC.goalCompletions.get(Number(HC.currentGaol?.id))?.sort((a, b) => b.date - a.date)[0].data
        }else{
            const startTime = new Date(HC.currentGaol.created_at).getTime()
            const linkedHabitId = HC.currentGaol.linkedHabit
            const completions = HC.habitsCompletions.get(linkedHabitId)
            const validComps = completions?.filter(c => new Date(Number(c.date)).getTime() > startTime)
            return validComps?.reduce((s, c) => s += c.data, 0) ?? 0
        }
    }



    return (
        <div className="w-full flex justify-center mb-10 font-mono">
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
                <div className="w-[90%] max-w-[600px] mt-20 p-10 z-10 texture drop-shadow-sm bg-panel1 text-title  outline-border outline-1 rounded-2xl flex justify-center flex-col items-center gap-2">
                    <p className="text-3xl font-semibold">
                        {HC.currentGaol.name}
                    </p>
                    <p className={`text-sm text-subtext1 ${!HC.currentGaol.description ? "absolute" : ""}`}>
                        {HC.currentGaol.description}
                    </p>
                    <div className="text-subtext2 hover:cursor-pointer absolute top-3 right-3">
                        <Select items={Array.from(HC.goals.values()).map(h =>({name: h.name, id: h.id}))} 
                                                selectedItem={{name: HC.currentGaol.name, id: HC.currentGaol.id}}
                                                setSelectedItem={(id: number) => HC.setCurrentGoal(HC.goals.get(id) ?? null)}
                                                setText={<HiOutlineSwitchHorizontal/>}
                                                style="outline-0 p-0 justify-end flex"/>
                    </div>
                </div>
                {!isGoalFinished? 
                    <CountDown/> :
                    <div className="bg-panel1 w-[90%] max-w-[600px] rounded-2xl p-5 flex justify-center  text-title drop-shadow-md outline-1 outline-border">
                        <p className="text-center">
                            🎉 Congratulations! You’ve completed your goal — amazing work and well done! 💪
                        </p>
                    </div>
                }
                {HC.currentGaol.type == HabitTypeE.Normal ? 
                 "" : 
                <GoalProgress/>
                 }
                <AvgConsistency/>
                <AssociatedHabits/>
            </div>}
        </div>
    )
}
