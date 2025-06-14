import { useContext} from "react";
import { UserContext } from "../Providers/UserProvider";
import { Util } from "../../utils/util";
import type { HabitTypeE } from "../../utils/types";
import ProgressPanel from "./ProgressPanel";




export default function GoalProgress() {

    const HC = useContext(UserContext)
    const startValue = HC.currentGaol?.startValue ?? 0
    const currenValue = HC.currentGaol?.currentValue ?? 0
    const targetValue = HC.currentGaol?.targetValue ?? 0
    
    return (
        <ProgressPanel title="Progress"
            text={`You currently have ${Util.pretifyData(currenValue, HC.currentGaol?.type as HabitTypeE)}
                logged with a goal of ${Util.pretifyData(targetValue, HC.currentGaol?.type as HabitTypeE)}`}
            value={(currenValue-startValue)/(targetValue-startValue)*100}/>
    )
}
