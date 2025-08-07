import { Util } from "../../utils/util"
import type { HabitType } from "../../utils/types"
import { useContext } from "react"
import { UserContext, type HabitStats } from "../Providers/UserProvider"
import ProgressPanel from "./ProgressPanel"

export default function AvgConsistency() {

    const HC = useContext(UserContext)
    const habits = Util.fetchMapItems<HabitType>(HC.currentGaol?.habits.split(",").map(i => Number(i)) ?? [], HC.habits)
    const concistencies = Util.fetchMapItems<HabitStats>(habits.map(h => h.id), HC.habitStats).map(s => s.compRate)
    const avg = Util.avgNumArr(concistencies.map(p => Number(p) * 100))

    return (
        <>
            <ProgressPanel title="Consistency"
                value={avg} small={true}/>
            <ProgressPanel title="Miss Rate"
            value={100 - avg} small={true}/>
        </>

    )
}
