import { useContext } from "react"
import { UserContext } from "./UserProvider"
import { Util } from "../utils/util"
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import ProgressBar from "./InputComponents/ProgressBar";
import { HabitUtil } from "../utils/HabitUtil";
import Select from "./InputComponents/Select";

export default function StatsTitle() {

    const HC = useContext(UserContext)
    const compRate = HabitUtil.getCompletionRate(HC.currentHabit, HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined)
    const strength = HabitUtil.getStrength(HC.currentHabit, HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined)
    const streak = HabitUtil.getStreak(HC.currentHabit, HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id) : undefined)
    const completions = HC.currentHabit ? HC.habitsCompletions.get(HC.currentHabit?.id)?.length : undefined
    return (
        <div className="bg-stone-800 rounded-md text-stone-300 font-mono w-[90%] max-w-[600px] p-4 pt-2 pb-5">
            <div className="flex items-center justify-between">
                <h1 className="text-stone-500">
                    {Util.capitilizeFirst(HC.currentHabit?.name)}
                </h1>
                <div className="text-stone-500 hover:cursor-pointer flex relative">
                   <Select habits={Array.from(HC.habits.values())} 
                                            selectedHabit={HC.currentHabit} 
                                            setSelectedHabit={HC.setCurrentHabit}
                                            setText={HiOutlineSwitchHorizontal}
                                            style="outline-0 p-0 justify-end flex"/>
                </div>
            </div>
            <div className="flex justify-center mt-4 flex-col gap-3">
                <div>
                    <div className="flex items-center justify-between">
                        <p className="text-lg mb-1">
                            Strength
                        </p>
                        <p className="mb-1">
                                {Math.round(strength)}%
                        </p>
                    </div>
                    <ProgressBar min={0} max={100} current={strength}/>
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <p className="text-lg mb-1">
                            Completion Rate
                        </p>
                        <p className="mb-1">
                            {Math.round(compRate * 100)}%
                        </p>
                    </div>
                    <ProgressBar min={0} max={1} current={compRate}/>
                </div>
                <p>Streak: {streak}</p>
                <p>Completions: {completions}</p>
            </div>
        </div>
    )
}
