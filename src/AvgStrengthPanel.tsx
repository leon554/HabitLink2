import { useContext } from "react"
import { UserContext, type HabitStats } from "./components/Providers/UserProvider"
import { Util } from "./utils/util"
import type { HabitType } from "./utils/types"
import ProgressPanel from "./components/goalComponenets/ProgressPanel"

export default function AvgStrengthPanel() {

    const HC = useContext(UserContext)
    const habits = Util.fetchMapItems<HabitType>(HC.currentGaol?.habits.split(",").map(i => Number(i)) ?? [], HC.habits)
    const strengths = Util.fetchMapItems<HabitStats>(habits.map(h => h.id), HC.habitStats).map(c => c.strength)
    const avg = Util.avgNumArr(strengths.map(p => Number(p)))

    return (
        <ProgressPanel title="Strength"
            value={avg} small={true}/>

    )
}
