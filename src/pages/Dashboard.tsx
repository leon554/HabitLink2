import { useContext} from "react"
import { AuthContext } from "../components/Session/AuthProvider"

export default function Dashboard() {
    const session = useContext(AuthContext)

    return (
        <div>
            <h1 className='text-4xl text-white'>Welcome Back, {session.user?.user_metadata.name}</h1>
        </div>
    )
}
