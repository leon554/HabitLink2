import { Util } from "../../utils/util"
import { useContext } from "react"
import { UserContext} from "../Providers/UserProvider"
import ProgressPanel from "./ProgressPanel"

export default function AvgConsistency() {

    const HC = useContext(UserContext)
    const concistencies = (HC.goalStats.get(HC.currentGaol?.id ?? 0)?.map(s => s.consistency) ?? []).filter(c => !isNaN(c))
    const avg = Util.avgNumArr(concistencies)

    return (
        <>
            <ProgressPanel title="Consistency"
                value={avg} small={true}/>
            <ProgressPanel title="Miss Rate"
            value={100 - avg} small={true}/>
        </>

    )
}
