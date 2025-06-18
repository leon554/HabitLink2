import { useContext} from "react";
import { UserContext } from "../Providers/UserProvider";
import { Util } from "../../utils/util";
import type { HabitTypeE } from "../../utils/types";
import ProgressPanel from "./ProgressPanel";




export default function GoalProgress() {

    const HC = useContext(UserContext)
    const startValue = HC.currentGaol?.startValue ?? 0
    const currenValue = getCurrentValue()
    const targetValue = HC.currentGaol?.targetValue ?? 0
    
    function getCurrentValue(){
        if(!HC.currentGaol?.linkedHabit){
            return HC.goalCompletions.get(Number(HC.currentGaol?.id))?.reduce((s, c) => s + c.data, 0) ?? 0
        }else{
            const startTime = new Date(HC.currentGaol.created_at).getTime()
            const linkedHabitId = HC.currentGaol.linkedHabit
            const completions = HC.habitsCompletions.get(linkedHabitId)
            const validComps = completions?.filter(c => new Date(Number(c.date)).getTime() > startTime)
            return validComps?.reduce((s, c) => s += c.data, 0) ?? 0
        }
    }
    return (
        <ProgressPanel title="Progress"
            text={`You currently have ${Util.pretifyData(currenValue, HC.currentGaol?.type as HabitTypeE)}
                logged with a goal of ${Util.pretifyData(targetValue, HC.currentGaol?.type as HabitTypeE)}`}
            value={(currenValue-startValue)/(targetValue-startValue)*100}/>
    )
}
