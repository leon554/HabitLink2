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

    return (
        <div className="bg-gray-100 text-gray-950 drop-shadow-md outline-gray-700 outline-1 w-[90%] max-w-[600px] p-5 rounded-2xl gap-4 flex flex-col items-center">
            <p className="text-xl">
                Associated Habits
            </p>
            <div className="w-full flex flex-col gap-2">
                {[...habits].map(h => {
                    if(h){
                        return(
                            <div key={h.id} className="flex items-center gap-3  outline-1 bg-blue-100/40 outline-gray-400 w-full p-3 rounded-xl justify-between hover:cursor-pointer" 
                                onClick={() => {
                                    HC.setCurrentHabit(h)
                                    navigate("/stats")
                                }}>
                                <div className="flex items-center gap-3">
                                    <img src={HC.habitRanks.get(h.id)} className="h-5"/>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl">
                                            {h.name}
                                        </p>
                                        <p className="text-stone-500">
                                            {h.id == HC.currentGaol?.linkedHabit ? <FaLink size={12}/> : ""}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-800">
                                        Consistency{String(Math.round(Number((HC.habitComps.get(Number(h.id))) ?? 0) * 100)).padStart(5, ".")}%
                                    </p>
                                    <p className="text-xs text-gray-800">
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
