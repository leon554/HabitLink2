import { useContext} from "react";
import { UserContext } from "../Providers/UserProvider";
import { Util } from "../../utils/util";
import ProgressPanel from "./ProgressPanel";
import useCurrentGoalValue from "../Hooks/useCurrentGoalValue";
import type { HabitTypeE } from "@/utils/types";
import { TbProgressCheck } from "react-icons/tb";


export default function GoalProgress() {

    const HC = useContext(UserContext)
    const startValue = HC.getCurrentGoal()?.startValue ?? 0
    let currentValue = useCurrentGoalValue()
    const targetValue = HC.getCurrentGoal()?.targetValue ?? 0
    
    return (
        <div className="mt-4">
            <ProgressPanel 
                title="Actaul Progress"
                icon={<TbProgressCheck />}
                text={`You have ${Util.pretifyGoalData(currentValue, HC.getCurrentGoal()?.type as HabitTypeE)}
                    logged with a goal of ${Util.pretifyGoalData(targetValue, HC.getCurrentGoal()?.type as HabitTypeE)} 
                  ${(startValue != 0) ? " starting with " + startValue : ""}`}
                value={Util.calculateProgress(startValue, currentValue, targetValue)*100} large={true}/>
        </div>
    )
}
