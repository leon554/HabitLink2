import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "../../utils/util"
import type { HabitType } from "../../utils/types"
import { useNavigate } from "react-router-dom"
import { FaLink } from "react-icons/fa";


export default function AssociatedHabits() {

    const HC = useContext(UserContext)
    const navigate = useNavigate()
    const habits = Util.fetchMapItems<HabitType>(HC.currentGaol?.habits.split(",") ?? [], HC.habits)

    return (
        <div className="text-stone-300 font-mono w-[90%] max-w-[600px] bg-stone-800 p-5 rounded-md gap-4 flex flex-col items-center">
            <p className="text-xl">
                Associated Habits
            </p>
            <div className="w-full flex flex-col gap-2">
                {[...habits, HC.habits.get(HC.currentGaol?.linkedHabit ?? -1) ?? null].map(h => {
                    if(h){
                        return(
                            <div key={h.id} className="flex items-center gap-3 outline-1 outline-stone-700 w-full p-3 rounded-md justify-between hover:cursor-pointer" 
                                onClick={() => {
                                    HC.setCurrentHabit(h)
                                    navigate("/stats")
                                }}>
                                <div className="flex items-center gap-3">
                                    <img src={HC.habitRanks.get(h.id)} className="h-5"/>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg">
                                            {h.name}
                                        </p>
                                        <p className="text-stone-500">
                                            {h.id == HC.currentGaol?.linkedHabit ? <FaLink size={12}/> : ""}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-400">
                                        Consistency{String(Math.round(Number((HC.habitComps.get(Number(h.id))) ?? 0) * 100)).padStart(5, ".")}%
                                    </p>
                                    <p className="text-xs text-stone-400">
                                        Strength{String(Math.round(Number((HC.habitStrengths.get(h.id)) ?? 0))).padStart(8, ".")}%
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
