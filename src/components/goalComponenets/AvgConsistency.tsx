import { Util } from "../../utils/util"
import type { HabitType } from "../../utils/types"
import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import ProgressPanel from "./ProgressPanel"

export default function AvgConsistency() {

    const HC = useContext(UserContext)
    const habits = Util.fetchMapItems<HabitType>(HC.currentGaol?.habits.split(",") ?? [], HC.habits)
    const concistencies = Util.fetchMapItems<string>(habits.map(h => h.id), HC.habitComps)
    const avg = Util.avgNumArr(concistencies.map(p => Number(p) * 100))

    return (
        <ProgressPanel title="Consistency"
            text="This is the avg consistency of all you associated habits."
            value={avg}/>

    )
}
