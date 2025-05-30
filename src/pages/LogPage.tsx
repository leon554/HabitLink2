//import { AuthContext } from "../components/Session/AuthProvider"
import { useContext } from "react"
import { UserContext } from "../components/UserProvider"
import HabitLogCard from "../components/HabitLogCard"

export default function LogPage() {
    //const session = useContext(AuthContext)
    const user = useContext(UserContext)

    return (
        <div className="flex flex-col items-center">
            <div className="w-[90%] flex flex-col items-start max-w-[600px]">
                <p className="text-stone-900 mt-25 font-mono text-3xl font-semibold text-center">
                    Log Your Habits 💪
                </p>
                <div className="flex w-[100%] flex-col no-scrollbar gap-2 items-center mt-10 mb-10 max-h-[74vh] rounded-md overflow-y-scroll">
                    {user.habits.map((h, i) => {
                        return(
                            <HabitLogCard habit={h} key={i}/>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
