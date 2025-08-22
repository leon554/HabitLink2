import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "../../utils/util"
import type { HabitType } from "../../utils/types"
import { useNavigate } from "react-router-dom"
import { FaLink } from "react-icons/fa";
import { TbLink } from "react-icons/tb";


export default function AssociatedHabits() {

    const HC = useContext(UserContext)
    const navigate = useNavigate()
    const habits = Util.fetchMapItems<HabitType>(HC.getCurrentGoal()?.habits.split(",").map(i => Number(i)) ?? [], HC.habits)

    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none bg-panel1 text-title drop-shadow-md outline-border outline-1 w-[90%] max-w-[600px] p-7 py-5 rounded-2xl gap-3 flex flex-col ">
           <div className="flex items-center gap-3 mb-1 mt-1">
                <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                    <TbLink />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-title font-semibold leading-none pb-1">
                        Progression
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-col gap-1.5 mb-1">
                {[...habits].map((h, i) => {
                    if(h){
                        return(
                            <div key={i} className={`shadow-sm shadow-gray-200 dark:shadow-none flex items-center bg-panel2 p-2 rounded-xl border-1 border-border2 justify-between hover:cursor-pointer hover:scale-99 transition-all duration-100 ease-in-out`} 
                                onClick={() => {
                                    HC.setCurrentHabit(h)
                                    navigate("/stats")
                                }}>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm  text-subtext2">
                                            {h.icon} {Util.capitilizeFirst(h.name)}
                                        </p>
                                        <p className="text-stone-500">
                                            {h.id == HC.getCurrentGoal()?.linkedHabit ? <FaLink size={12}/> : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <p className="text-xs text-subtext2">
                                        📈 {Math.round((HC.goalStats.get(HC.currentGaol ?? 0)?? []).filter(s => s.habitID == h.id)[0]?.consistency)}%
                                    </p>
                                    <p className="text-xs text-subtext2">
                                        💪 {Math.round((HC.goalStats.get(HC.currentGaol ?? 0)?? []).filter(s => s.habitID == h.id)[0]?.strength)}%
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
