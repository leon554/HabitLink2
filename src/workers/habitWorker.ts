import type { HabitType, GoalType, HabitCompletionType, HabitTypeE, ChartDataType} from "@/utils/types"
import  type { HabitStats, GaolStats } from "@/components/Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"
import { Util } from "@/utils/util"


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
    const prev = Util.preventNan
    habits.forEach(h => {
        const currentHabitComps = habitsCompletions.get(h.id) ?? []

        const {compRate, missedSessions, validCompletions: validComps, completableDays, compsPerWeek} = HabitUtil.getCompletionRate(h, currentHabitComps)
        const strength = prev(HabitUtil.getStrength(h, currentHabitComps))
        const streak = prev(HabitUtil.getStreak(h, currentHabitComps))
        const {validComps: completions, partialComps} = HabitUtil.getCompletions(h, currentHabitComps)
        const entries = prev(h ? habitsCompletions.get(Number(h.id))?.length : 0)
        const dataSum = prev(HabitUtil.getHabitDataSum(currentHabitComps, h?.type as HabitTypeE))
        const chartData = HabitUtil.getCompRateStrengthOverTimeChartData(h, currentHabitComps) as ChartDataType[]
        const compsPerMonth = HabitUtil.getCompletionsPerMonth(h, habitsCompletions.get(h.id))


        const data = {
            compRate: isNaN(compRate) ? 0 : Math.min(Math.max(0, compRate), 1), 
            missedSessions : prev(missedSessions), 
            validComps: prev(validComps), 
            completableDays,
            strength,
            streak,
            completions: prev(completions),
            partialComps: prev(partialComps),
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