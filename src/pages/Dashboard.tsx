import { useContext} from "react"
import { AuthContext } from "../components/Session/AuthProvider"

export default function Dashboard() {
    const session = useContext(AuthContext)

    return (
        <div className="mt-20">
            <h1 className='text-4xl text-black'>Welcome Back, {session.user?.user_metadata.name}</h1>
        </div>
    )
}
