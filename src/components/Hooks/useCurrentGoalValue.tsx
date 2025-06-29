import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"


export default function useCurrentGoalValue(){
    const HC = useContext(UserContext)
    let currentValue: undefined | number

    if(!HC.currentGaol?.linkedHabit){
        currentValue = HC.goalCompletions.get(Number(HC.currentGaol?.id))?.sort((a, b) => b.date - a.date)[0].data
    }else{
        const startTime = new Date(HC.currentGaol.created_at).getTime()
        const linkedHabitId = HC.currentGaol.linkedHabit
        const completions = HC.habitsCompletions.get(linkedHabitId)
        const validComps = completions?.filter(c => new Date(Number(c.date)).getTime() > startTime)
        currentValue =  validComps?.reduce((s, c) => s += c.data, 0) ?? 0
    }

    return currentValue ?? HC.currentGaol?.startValue ?? 0    
}