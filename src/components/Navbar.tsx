import { useContext, useState} from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "./Providers/AuthProvider"
import { LuLogOut } from "react-icons/lu";
import { AiOutlineLoading } from "react-icons/ai";
import Model from "./InputComponents/Model";



export default function Navbar() {
    const {session, logout, loading} = useContext(AuthContext)
    const [createShow, setCreatShow] = useState(false)

    
    return (
        <>
            <div className="bg-blue-400 flex justify-between h-13 items-stretch p-0 fixed top-0 left-0 w-full z-50">
                <div className="flex items-center">
                    <p className="ml-4 text-gray-800 font-mono text-xl">
                        HabitLink
                    </p>
                </div>
                <div className="flex">
                    { !session ? <>
                        <Link to={"/auth"}>
                            <button className="h-13 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 text-md hover:bg-blue-300 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                Sign up
                            </button>
                        </Link>
                        <Link to={"/"}> 
                            <button className="pl-4 pr-4 h-13 font-medium text-sm font-mono text-gray-800 text-md hover:bg-blue-300 hover:text-stone-800  ease-in-out duration-150 hover:cursor-pointer">Landing Page</button>
                        </Link></> : 
                        <>
                            <Link to={"/dashboard"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 text-md hover:bg-blue-300 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Home
                                </button>
                            </Link>
                            <Link to={"/log"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 text-md hover:bg-blue-300 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Log
                                </button>
                            </Link>
                            <Link to={"/stats"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 text-md hover:bg-blue-300 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Stats
                                </button>
                            </Link>
                            <Link to={"/goals"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 text-md hover:bg-blue-300 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Goals
                                </button>
                            </Link>
                            
                            <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 text-md hover:bg-blue-300 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer"
                                onClick={() => setCreatShow(true)}>
                                Create
                            </button>
                        
                            <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 text-md hover:bg-blue-300 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer"
                                onClick={logout}>
                                {loading? <AiOutlineLoading className="animate-spin"/> : <LuLogOut />}
                            </button>
                        </>
                    }
                </div>
            </div>
            <Model open={createShow} onClose={() => setCreatShow(false)} blur={false} positionX={10} positionY={110} fit={false}>
                <div className="text-stone-300 text-[13px] font-mono gap-1 flex flex-col p-2 outline-1 outline-stone-600 bg-stone-800 rounded-md">
                    <Link to={"/create"}>
                        <button
                        className="w-full hover:bg-blue-300 px-3 p-2 rounded-md hover:text-stone-800 hover:cursor-pointer transition-colors ease-in-out duration-150"
                        onClick={() => setCreatShow(false)}
                        >
                        New Habit
                        </button>
                    </Link>
                    <Link to={"/creategoal"}>
                        <button
                        className="w-full hover:bg-blue-300 px-3 p-2 rounded-md hover:text-stone-800 hover:cursor-pointer transition-colors ease-in-out duration-150"
                        onClick={() => setCreatShow(false)}
                        >
                        New Goal
                        </button>
                    </Link>
                </div>
            </Model>
        </>
    )
}
