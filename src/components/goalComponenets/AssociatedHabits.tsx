import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "../../utils/util"
import type { HabitType } from "../../utils/types"
import { useNavigate } from "react-router-dom"
import { FaLink } from "react-icons/fa";


export default function AssociatedHabits() {

    const HC = useContext(UserContext)
    const navigate = useNavigate()
    const habits = Util.fetchMapItems<HabitType>(HC.currentGaol?.habits.split(",").map(i => Number(i)) ?? [], HC.habits)
    const habitsLength = habits.length

    return (
        <div className="bg-panel1 text-title drop-shadow-md outline-border outline-1 w-[90%] max-w-[600px] p-5 rounded-2xl gap-3 flex flex-col ">
            <p className="text-lg font-medium">
                Associated Habits
            </p>
            <div className="w-full flex flex-col gap-0.5 mb-1">
                {[...habits].map((h, i) => {
                    if(h){
                        return(
                            <div key={h.id} className={`flex items-center gap-3   ${i == habitsLength -1 ? "" : "border-border2 border-b-1 pb-5"} w-full py-3  justify-between hover:cursor-pointer h-10`} 
                                onClick={() => {
                                    HC.setCurrentHabit(h)
                                    navigate("/stats")
                                }}>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <p className="text-md text-subtext1">
                                            {h.icon} {Util.capitilizeFirst(h.name)}
                                        </p>
                                        <p className="text-stone-500">
                                            {h.id == HC.currentGaol?.linkedHabit ? <FaLink size={12}/> : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <p className="text-xs text-subtext2">
                                        📈 {Math.round(Number((HC.habitStats.get(Number(h.id))?.compRate) ?? 0) * 100)}%
                                    </p>
                                    <p className="text-xs text-subtext2">
                                        💪 {Math.round(Number((HC.habitStats.get(h.id)?.strength) ?? 0))}%
                                    </p>
                                </div>
                            </div>
                    )
                    }
                })}
            </div>
        </div>
    )
}
