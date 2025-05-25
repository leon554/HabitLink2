import { useContext} from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "./Session/AuthProvider"

export default function Navbar() {
    const {session, logout} = useContext(AuthContext)
    
    return (
        <div className="bg-stone-800 flex justify-between h-13 items-stretch p-0">
            <div className="flex items-center">
                <p className="ml-4 text-gray-100 font-mono text-xl">
                    HabitLink
                </p>
            </div>
            <div>
                { !session ? <>
                    <Link to={"/auth"}>
                        <button className="h-13 pl-4 pr-4 font-medium text-sm font-mono text-gray-300 text-md hover:bg-green-400 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                            Sign up
                        </button>
                    </Link>
                    <Link to={"/"}> 
                        <button className="pl-4 pr-4 h-13 font-medium text-sm font-mono text-gray-300 text-md hover:bg-green-400 hover:text-stone-800  ease-in-out duration-150 hover:cursor-pointer">Landing Page</button>
                    </Link></> : 
                    <>
                        <Link to={"/dashboard"}>
                            <button className="h-13 pl-4 pr-4 font-medium text-sm font-mono text-gray-300 text-md hover:bg-green-400 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                Home
                            </button>
                        </Link>
                        <Link to={"/log"}>
                            <button className="h-13 pl-4 pr-4 font-medium text-sm font-mono text-gray-300 text-md hover:bg-green-400 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                Log
                            </button>
                        </Link>
                        <Link to={"/create"}>
                            <button className="h-13 pl-4 pr-4 font-medium text-sm font-mono text-gray-300 text-md hover:bg-green-400 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                Create
                            </button>
                        </Link>
                        <button className="h-13 pl-4 pr-4 font-medium text-sm font-mono text-gray-300 text-md hover:bg-green-400 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer"
                            onClick={logout}>
                            Log Out
                        </button>
                    </>
                }
            </div>
        </div>
    )
}
