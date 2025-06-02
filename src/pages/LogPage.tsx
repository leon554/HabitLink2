import { useContext } from "react"
import { UserContext } from "../components/UserProvider"
import HabitLogCard from "../components/HabitLogCard"
import { HabitTypeE } from "../utils/types"

export default function LogPage() {
    const user = useContext(UserContext)

    return (
        <div className="flex flex-col items-center">
            <div className="w-[90%] flex flex-col items-start max-w-[600px]">
                <div className="bg-stone-800 rounded-md w-full p-4 flex justify-center items-center mt-24">
                    <p className="text-stone-200 font-mono text-2xl font-normal text-center">
                        Log Your Habits
                    </p>
                </div>
                <div className="flex w-[100%] flex-col scroll-smooth  no-scrollbar gap-2 items-center mt-2 mb-10 max-h-[72vh] rounded-md overflow-y-scroll">
                    {Array.from(user.habits.values()).map((h, i) => {
                        if(h.type === HabitTypeE.Normal){
                            return(
                                <div className="w-full  ">
                                    <HabitLogCard habit={h} key={i}/>
                                </div>
                            )
                        }
                    })}
                    {Array.from(user.habits.values()).map((h, i) => {
                        if(h.type !== HabitTypeE.Normal){
                            return(
                                <div className="w-full  ">
                                    <HabitLogCard habit={h} key={i}/>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
