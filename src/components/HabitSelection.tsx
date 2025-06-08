import { useContext } from "react"
import { UserContext } from "./Providers/UserProvider"
import { Util } from "../utils/util"

export default function HabitSelection() {

    const HC = useContext(UserContext)

    return (
        <div className=" bg-stone-800 p-2 flex flex-col items-start pb-3 gap-1 w-50 h-screen/2 rounded-md">
            <p className="font-mono text-stone-300 m-2">
                Select Habit
            </p>
            {Array.from(HC.habits.values()).map((h,i) => {
                return(
                    <div className={`${HC.currentHabit?.id == h.id ? "bg-green-400 text-stone-800" : "outline-stone-700"} outline-0 hover:outline-1 p-2 hover:cursor-pointer hover:bg-green-400 hover:text-stone-800 w-full rounded-md text-stone-400  transition duration-100 ease-in-out`}
                        key={i}
                        onClick={() => HC.setCurrentHabit(h)}>
                        <p className="font-mono text-sm">
                            {Util.capitilizeFirst(h.name)}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}
