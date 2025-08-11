import { useContext } from "react"
import { UserContext} from "./components/Providers/UserProvider"
import { Util } from "./utils/util"
import ProgressPanel from "./components/goalComponenets/ProgressPanel"

export default function AvgStrengthPanel() {

    const HC = useContext(UserContext)
    const strengths = HC.goalStats.get(HC.currentGaol?.id ?? 0)?.map(s => s.strength) ?? []
    const avg = Util.avgNumArr(strengths)

    return (
        <ProgressPanel title="Strength"
            value={avg} small={true}/>

    )
}
