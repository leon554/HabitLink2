//import { AuthContext } from "../components/Session/AuthProvider"
import { useContext } from "react"
import { UserContext } from "../components/UserProvider"
import HabitLogCard from "../components/HabitLogCard"

export default function LogPage() {
    //const session = useContext(AuthContext)
    const user = useContext(UserContext)

    return (
        <div className="">
            <p className="text-stone-900 mt-25 font-mono text-3xl font-semibold text-center">
                Log Your Habits 💪
            </p>
            <div className="flex flex-col no-scrollbar gap-2 items-center mt-10 mb-10 max-h-130 rounded-md overflow-y-scroll">
                {user.habits.map((h, i) => {
                    return(
                        <HabitLogCard habit={h} key={i}/>
                    )
                })}
            </div>
        </div>
    )
}
