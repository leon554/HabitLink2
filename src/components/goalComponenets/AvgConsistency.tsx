import { Util } from "../../utils/util"
import type { HabitType } from "../../utils/types"
import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import ProgressPanel from "./ProgressPanel"

export default function AvgConsistency() {

    const HC = useContext(UserContext)
    const habits = Util.fetchMapItems<HabitType>(HC.currentGaol?.habits.split(",").map(i => Number(i)) ?? [], HC.habits)
    const concistencies = Util.fetchMapItems<number>(habits.map(h => h.id), HC.habitComps)
    const avg = Util.avgNumArr(concistencies.map(p => Number(p) * 100))

    return (
        <>
            <ProgressPanel title="Consistency"
                value={avg}/>
            <ProgressPanel title="Miss Rate"
            value={100 - avg}/>
        </>

    )
}
