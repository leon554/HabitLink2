import { useContext } from "react"
import InfoBox from "../StatsComponents/InfoBox"
import { type HabitType } from "@/utils/types"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"

export default function GoalSummary() {

    const HC = useContext(UserContext)
    const habits = Util.fetchMapItems<HabitType>(HC.currentGaol?.habits.split(",").map(i => Number(i)) ?? [], HC.habits)
    

    return (
        <div className="w-[90%] max-w-[600px] relative bg-panel1 rounded-2xl font outline-1 font-mono outline-border text-title justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4">
            <div className="w-full">
                <p className="text-lg text-leftr mb-1 mt-1 font-sans">
                    Overview
                </p>
            </div>
            <div className="gap-3 gap-x-14 grid-cols-2 grid  items-stretch w-full">
                <InfoBox value={String(habits.length)} text="Associated Habits" toolTipText="This is the current streak of your habit"/>
                <InfoBox value={String(habits.length)} text="Associated Habits" toolTipText="This is the current streak of your habit"/>
            </div>
        </div>
    )
}
