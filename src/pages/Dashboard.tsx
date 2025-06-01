import {useContext} from "react"
import {AuthContext} from "../components/Session/AuthProvider"
import {UserContext} from "../components/UserProvider"


export default function Dashboard() {
    const session = useContext(AuthContext)
    const {habitsCompletions, habits} = useContext(UserContext)

    return (
        <div className="mt-20">
            <h1 className='text-4xl text-black'>Welcome Back, {session.user?.user_metadata.name}</h1>
            {Array.from(habitsCompletions.values()).map(hcs => {
                return (
                    <div>
                        <p className="p-5 font-mono">Name: {habits.get(hcs[0].habitId)?.name}</p>
                        {hcs.map(h => {
                            return(
                                <p>{h.data}, {new Date(Number(h.date)).toLocaleDateString()}, Name: {habits.get(h.habitId)?.name}</p>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
