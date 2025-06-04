import {useContext} from "react"
import {AuthContext} from "../components/Session/AuthProvider"
import { Util } from "../utils/util"


export default function Dashboard() {
    const session = useContext(AuthContext)

    return (
        <div className="mt-20">
            <h1 className='text-4xl text-black ml-10'>
                Welcome Back, {Util.capitilizeFirst(session.user?.user_metadata.name)}
            </h1>
            
        </div>
    )
}
