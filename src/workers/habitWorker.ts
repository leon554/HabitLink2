import type { HabitType, GoalType, HabitCompletionType, HabitTypeE, ChartDataType} from "@/utils/types"
import  type { HabitStats, GaolStats } from "@/components/Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"


export interface habitWorkerPayload{
    habits: Map<number, HabitType>
    goals: Map<number, GoalType>
    habitsCompletions: Map<number, HabitCompletionType[]>
}
export interface habitWorkerReturnType{
    habitStats: Map<number, HabitStats>
    goalStats: Map<number, GaolStats[]>
}

self.onmessage = function(event){
    const result = calculateStat(event.data as habitWorkerPayload)
    postMessage(result)
}


function calculateStat({habits, habitsCompletions, goals}: habitWorkerPayload){
    const HabitStatsMap = new Map<number, HabitStats>()
    habits.forEach(h => {
        const currentHabitComps = habitsCompletions.get(h.id)

        const {compRate, missedSessions, validCompletions: validComps, completableDays, compsPerWeek} = HabitUtil.getCompletionRate(h, currentHabitComps)
        const strength = HabitUtil.getStrength(h, currentHabitComps)
        const streak = HabitUtil.getStreak(h, currentHabitComps)
        const {validComps: completions, partialComps} = HabitUtil.getCompletions(h, currentHabitComps)
        const entries = h ? habitsCompletions.get(Number(h.id))?.length : 0
        const dataSum = HabitUtil.getHabitDataSum(currentHabitComps, h?.type as HabitTypeE)
        const chartData = HabitUtil.getCompRateStrengthOverTimeChartData(h, currentHabitComps) as ChartDataType[]
        const compsPerMonth = HabitUtil.getCompletionsPerMonth(h, habitsCompletions.get(h.id))


        const data = {
            compRate, 
            missedSessions, 
            validComps, 
            completableDays,
            strength,
            streak,
            completions,
            partialComps,
            entries,
            dataSum,
            chartData,
            compsPerWeek,
            compsPerMonth
        } as HabitStats
        HabitStatsMap.set(h.id, data)
    })

    const goalStats = new Map<number, GaolStats[]>()
    goals.forEach(g => {
        const ids = g.habits.split(",").map(id => Number(id))
        const stats: GaolStats[] = []
        ids.forEach(id => {
            const result = HabitUtil.getGoalCompAndStrength(habits.get(id), habitsCompletions.get(id), new Date(g.created_at))
            stats.push({...result, habitID: id} as GaolStats)
        })
        goalStats.set(g.id, stats)
    })
    return {habitStats: HabitStatsMap, goalStats: goalStats}
}