import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"


export default function useCurrentGoalValue(){
    const HC = useContext(UserContext)
    let currentValue: undefined | number

    if(!HC.getCurrentGoal()?.linkedHabit){
        currentValue = HC.goalCompletions.get(Number(HC.getCurrentGoal()?.id))?.sort((a, b) => b.date - a.date)[0].data
    }else{
        const startTime = new Date(HC.getCurrentGoal()!.created_at).getTime()
        const linkedHabitId = HC.getCurrentGoal()?.linkedHabit
        const completions = HC.habitsCompletions.get(linkedHabitId!)
        const validComps = completions?.filter(c => new Date(Number(c.date)).getTime() > startTime)
        currentValue =  validComps?.reduce((s, c) => s += c.data, 0) ?? 0
    }

    return currentValue ?? HC.getCurrentGoal()?.startValue ?? 0    
}