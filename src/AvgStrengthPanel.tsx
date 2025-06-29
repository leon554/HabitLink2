import { useContext } from "react"
import { UserContext } from "./components/Providers/UserProvider"
import { Util } from "./utils/util"
import type { HabitType } from "./utils/types"
import ProgressPanel from "./components/goalComponenets/ProgressPanel"

export default function AvgStrengthPanel() {

    const HC = useContext(UserContext)
    const habits = Util.fetchMapItems<HabitType>(HC.currentGaol?.habits.split(",").map(i => Number(i)) ?? [], HC.habits)
    const strengths = Util.fetchMapItems<number>(habits.map(h => h.id), HC.habitStrengths)
    const avg = Util.avgNumArr(strengths.map(p => Number(p)))

    return (
        <ProgressPanel title="Strength"
            text="This is the avg strength of all you associated habits."
            value={avg}/>

    )
}
