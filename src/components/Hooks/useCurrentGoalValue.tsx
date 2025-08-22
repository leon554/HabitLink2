import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"


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
        if(!validComps) return 0

        if(HC.getCurrentGoal()?.countdata){
            currentValue =  validComps?.reduce((s, c) => s += c.data, 0) ?? 0
        }else{
            const habit = HC.habits.get(linkedHabitId ?? 0)
            if(!habit) return 0

            currentValue = 0
            const groupedEntries = HabitUtil.groupHabitEntriesByDay(validComps)
            groupedEntries.forEach(g => {
                const isCompletedDay = g.reduce((s, c) => s += c.data, 0) >= habit.target
                currentValue! += isCompletedDay ? 1 : 0
            })
        }
    }

    return currentValue ?? HC.getCurrentGoal()?.startValue ?? 0    
}