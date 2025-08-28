import { useMemo } from "react";
import type { HabitType, GoalType, HabitCompletionType, HabitStats} from "@/utils/types";
import { AchievementsEnum } from "@/utils/types";
import { Util } from "@/utils/util";


export function useAchievementChecks(
    habits: Map<number, HabitType>, 
    goals: Map<number, GoalType>, 
    habitsCompletions: Map<number, HabitCompletionType[]>, 
    habitStats: Map<number, HabitStats>,
    update: boolean
) {

    const {totalCompletions,maxStreak,avgStrength,avgComp, missedDays} = useMemo(() => {

        const habitStatsArr = Array.from(habitStats.values())
        const completions = Array.from(habitsCompletions.values()).flat().length;
        const streaks = habitStatsArr.map(s => s.streak);
        const strengths = habitStatsArr.map(h => h.strength);
        const avgConsistency = Util.avgNumArr(habitStatsArr.map(s => s.compRate))

        return {
            totalCompletions: completions,
            maxStreak: streaks.length ? Math.max(...streaks) : 0,
            avgStrength: strengths.length ? strengths.reduce((a, b) => a + b, 0) / strengths.length: 0,
            missedDays: habitStatsArr.reduce((a, c) => a += c.missedSessions, 0),
            avgComp: avgConsistency * 100
        };
        
    }, [habitsCompletions, habitStats, update]);


    const achievementChecks: Record<number, () => boolean> = useMemo(() => ({
        [AchievementsEnum.create5Habits]: () => habits.size >= 5,
        [AchievementsEnum.have3ActiveGoals]: () => goals.size >= 3,

        // Completions
        [AchievementsEnum.habitEntries100]: () => totalCompletions >= 100,
        [AchievementsEnum.habitEntries250]: () => totalCompletions >= 250,
        [AchievementsEnum.habitEntries500]: () => totalCompletions >= 500,
        [AchievementsEnum.habitEntries1000]: () => totalCompletions >= 1000,
        [AchievementsEnum.habitEntries5000]: () => totalCompletions >= 5000,
        [AchievementsEnum.habitEntries10000]: () => totalCompletions >= 10000,

        // Streaks
        [AchievementsEnum.streak10]: () => maxStreak >= 10,
        [AchievementsEnum.streak20]: () => maxStreak >= 20,
        [AchievementsEnum.streak50]: () => maxStreak >= 50,
        [AchievementsEnum.streak100]: () => maxStreak >= 100,
        [AchievementsEnum.streak365]: () => maxStreak >= 365,

        // Avg strength
        [AchievementsEnum.avgStrength20]: () => avgStrength >= 20,
        [AchievementsEnum.avgStrength50]: () => avgStrength >= 50,
        [AchievementsEnum.avgStrength80]: () => avgStrength >= 80,
        [AchievementsEnum.avgStrength100]: () => avgStrength >= 100,

        [AchievementsEnum.perfection]: () => avgStrength >= 100 && avgComp >= 100 && missedDays == 0,
        [AchievementsEnum.perfection95]: () => avgStrength >= 95 && avgComp >= 95 && missedDays <= 10,
        [AchievementsEnum.perfection80]: () => avgStrength >= 85 && avgComp >= 85 && missedDays <= 20,
        [AchievementsEnum.perfection50]: () => avgStrength >= 50 && avgComp >= 50 && missedDays <= 50,

    }), [ habits.size, goals.size, totalCompletions, maxStreak, avgStrength, avgComp, missedDays]); //this needs all the values returned from the above mem0

    return achievementChecks;
}
