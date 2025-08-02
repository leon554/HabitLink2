import { useContext } from "react"
import InfoBox from "../StatsComponents/InfoBox"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { differenceInDays } from "date-fns"

export default function DashBoardStats() {

    const HC = useContext(UserContext)
    const habitStats = Util.fetchAllMapItems(HC.habitStats)
    const habits = Util.fetchAllMapItems(HC.habits)
    const avgHabitAge = Util.avgNumArr(habits.map(h => new Date(Number(h.creationDate)).getTime()))
    const goals = Util.fetchAllMapItems(HC.goals)
    const avgGoalAge = Util.avgNumArr(goals.map(h => new Date(h.created_at).getTime()))
    const strengths = habitStats.map(h => h.strength)
    const consistencies = habitStats.map(h => h.compRate)
    const entries = Util.fetchAllMapItems(HC.habitsCompletions).reduce((s, a) => [...s, ...a], [])

    return (
        <div className="m-7 my-5 flex flex-col gap-5">
            <p className="text-lg text-title font-medium">
                Statistics
            </p>
            <div className="grid grid-cols-2 gap-x-17 gap-3">
                <InfoBox value={habits.length} text="Habit Count" toolTipText=""/>
                <InfoBox value={goals.length} text="Goal Count" toolTipText=""/>
                <InfoBox value={Math.round(Math.min(Math.max(...strengths), 100))+ "%"} text="Max Strength" toolTipText=""/>
                <InfoBox value={Math.round(Math.max(...consistencies)*100)+ "%"} text="Max Consistency" toolTipText=""/>
                <InfoBox value={Math.round(Math.min(...strengths)) + "%"} text="Min Strength" toolTipText=""/>
                <InfoBox value={Math.round(Math.min(...consistencies)*100)+ "%"} text="Min Consistency" toolTipText=""/>
                <InfoBox value={Math.round(Util.avgNumArr(strengths))} text="Strength Avg" toolTipText=""/>
                <InfoBox value={Math.round(Util.avgNumArr(consistencies)*100) + "%"} text="Consistency Avg" toolTipText=""/>
                <InfoBox value={Math.round(Util.standardDeviation(strengths))} text="Strength SD" toolTipText=""/>
                <InfoBox value={Math.round(Util.standardDeviation(consistencies)*100)} text="Consistency SD" toolTipText=""/>
                <InfoBox value={Math.max(...habitStats.map(s => s.streak))} text="Best Streak" toolTipText=""/>
                <InfoBox value={entries.length} text="Total Entries" toolTipText=""/>
                <InfoBox value={Math.min(...habitStats.map(s => s.streak))} text="Worst Streak" toolTipText=""/>
                <InfoBox value={habitStats.map(s => s.completions).reduce((s, a) => s + a, 0)} text="Total Completions" toolTipText=""/>
                <InfoBox value={Math.round(Util.avgNumArr(habitStats.map(s => s.streak)))} text="Avg Streak" toolTipText=""/>
                <InfoBox value={(habitStats.map(s => s.validComps)).reduce((s, a) => s+ a, 0)} text="Valid Completions" toolTipText=""/>
                <InfoBox value={(habitStats.map(s => s.partialComps)).reduce((s, a) => s+ a, 0)} text="Partial Completions" toolTipText=""/>
                <InfoBox value={(habitStats.map(s => s.missedSessions)).reduce((s, a) => s+ a, 0)} text="Missed Days" toolTipText=""/>
                <InfoBox value={differenceInDays(new Date(), new Date(avgHabitAge)) + "d"} text="Avg Habit Age" toolTipText=""/>
                <InfoBox value={differenceInDays(new Date(), new Date(avgGoalAge)) + "d"} text="Avg Goal Age" toolTipText=""/>
            </div>
        </div>
    )
}
