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
        <div className="m-7 my-5 flex flex-col gap-5 relative h-full">
            <p className="text-lg text-title font-medium">
                Statistics
            </p>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-x-17 gap-3    no-scrollbar  relative z-0">
                <InfoBox value={habits.length} text="Habit Count" toolTipText="Total amount of habit you have"/>
                <InfoBox value={goals.length} text="Goal Count" toolTipText="Total amount of goals you have"/>
                <InfoBox value={Math.round(Math.min(Math.max(...strengths), 100))+ "%"} text="Max Strength" toolTipText="The highest strength of all your habits"/>
                <InfoBox value={Math.round(Math.max(...consistencies)*100)+ "%"} text="Max Consistency" toolTipText="The highest consistency of all your habits"/>
                <InfoBox value={Math.round(Math.min(...strengths)) + "%"} text="Min Strength" toolTipText="The lowest strenght of all of your habits"/>
                <InfoBox value={Math.round(Math.min(...consistencies)*100)+ "%"} text="Min Consistency" toolTipText="The lowest consistency of all of your habits "/>
                <InfoBox value={Math.round(Util.avgNumArr(strengths))} text="Strength Avg" toolTipText="The average strength of all your habits. "/>
                <InfoBox value={Math.round(Util.avgNumArr(consistencies)*100) + "%"} text="Consistency Avg" toolTipText="The Avg consistency of all your habits"/>
                <InfoBox value={Math.round(Util.standardDeviation(strengths))} text="Strength SD" toolTipText="The standard deviation of all your habits strengths"/>
                <InfoBox value={Math.round(Util.standardDeviation(consistencies)*100)} text="Consistency SD" toolTipText=""/>
                <InfoBox value={Math.max(...habitStats.map(s => s.streak))} text="Best Streak" toolTipText="The best streak of all your habits"/>
                <InfoBox value={entries.length} text="Total Entries" toolTipText="Total entries of all your habits. A entry just counts as data you logged regarless if you had a specific habit scheduled or if you met a specific habits goal."/>
                <InfoBox value={Math.min(...habitStats.map(s => s.streak))} text="Worst Streak" toolTipText="The worst streak of all your habits"/>
                <InfoBox value={habitStats.map(s => s.completions).reduce((s, a) => s + a, 0)} text="Total Completions" toolTipText="The total completions of all your habits. A completion counts as a day where you met a habits goal regardless if it was scheduled for that day or not"/>
                <InfoBox value={Math.round(Util.avgNumArr(habitStats.map(s => s.streak)))} text="Avg Streak" toolTipText="The average streak of all your habits"/>
                <InfoBox value={(habitStats.map(s => s.validComps)).reduce((s, a) => s+ a, 0)} text="Valid Completions" toolTipText="The total valid completions of all of your habits. A valid completion counts as a day where a habit was scheduled and you reached its goal/target"/>
                <InfoBox value={(habitStats.map(s => s.partialComps)).reduce((s, a) => s+ a, 0)} text="Partial Completions" toolTipText="The total partial completions of all your habits. A partial completions counts as a day you logged a habit but didnt reach its goal regardless if it was due or not"/>
                <InfoBox value={(habitStats.map(s => s.missedSessions)).reduce((s, a) => s+ a, 0)} text="Missed Days" toolTipText="The total days where a habit was scheduled but it was't completed/goal wasn's reached"/>
                <InfoBox value={differenceInDays(new Date(), new Date(avgHabitAge)) + "d"} text="Avg Habit Age" toolTipText="The average age of all your habits"/>
                <InfoBox value={differenceInDays(new Date(), new Date(avgGoalAge)) + "d"} text="Avg Goal Age" toolTipText="The average age of all your goals"/>
            </div>
        </div>
    )
}
