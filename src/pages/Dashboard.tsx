import { useContext} from "react"
import { AuthContext } from "../components/Session/AuthProvider"
import { UserContext } from "../components/UserProvider"
import HabitLogCard from "../components/HabitLogCard"

export default function Dashboard() {
    const session = useContext(AuthContext)
    const user = useContext(UserContext)

    return (
        <div className="mt-20">
            <h1 className='text-4xl text-black'>Welcome Back, {session.user?.user_metadata.name}</h1>
            
            
            <div className="flex flex-col gap-5 items-center mt-10">

                {user.habits.map((h, i) => {
                    return(
                        <HabitLogCard habit={h} key={i}/>
                    )
                })}
            </div>
        </div>
    )
}
