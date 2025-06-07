import { useContext } from "react"
import { UserContext } from "./Providers/UserProvider"
import { Util } from "../utils/util"
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { HabitUtil } from "../utils/HabitUtil";
import Select from "./InputComponents/Select";
import CircularProgressBar from "./CircularProgressBar";

export default function StatsTitle() {

    const HC = useContext(UserContext)

    const currentHabitCompletions = HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined
    const compRate = HabitUtil.getCompletionRate(HC.currentHabit, currentHabitCompletions)
    const strength = HabitUtil.getStrength(HC.currentHabit, currentHabitCompletions)
    
    return (
        <div className="bg-stone-800 rounded-md text-stone-300 font-mono w-[90%] max-w-[600px] p-6 pt-3 pb-4">
            <div className="flex items-center justify-between">
                <h1 className="text-stone-500">
                    {Util.capitilizeFirst(HC.currentHabit?.name)}
                </h1>
                <div className="text-stone-500 hover:cursor-pointer flex relative">
                   <Select habits={Array.from(HC.habits.values())} 
                                            selectedHabit={HC.currentHabit} 
                                            setSelectedHabit={HC.setCurrentHabit}
                                            setText={HiOutlineSwitchHorizontal}
                                            style="outline-0 p-0 justify-end flex "/>
                </div>
            </div>
            <div className="flex justify-evenly mt-7  gap-3 ">                
                <CircularProgressBar value={compRate*100} text="Consistency"/>
                <CircularProgressBar value={Math.round(strength)} text="Strength"/>
            </div>
        </div>
    )
}
