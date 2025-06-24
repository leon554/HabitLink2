import { useContext} from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "./Providers/AuthProvider"
import { AiOutlineLoading } from "react-icons/ai";
import Select from "./InputComponents/Select";
import { FaRegUserCircle } from "react-icons/fa";



export default function Navbar() {
    const {session, logout, loading} = useContext(AuthContext)
    const navitgate = useNavigate()
    
    return (
        <>
            <div className="bg-blue-400 dark:bg-neutral-800 dark:border-b-1 dark:border-neutral-700/60 flex justify-between h-13 items-stretch p-0 fixed top-0 left-0 w-full z-30">
                <div className="flex items-center">
                    <p className="ml-4 text-gray-800 dark:text-neutral-100 font-mono text-xl">
                        HabitLink
                    </p>
                </div>
                <div className="flex">
                    { !session ? <>
                        <Link to={"/auth"}>
                            <button className="h-13 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                Sign up
                            </button>
                        </Link>
                        <Link to={"/"}> 
                            <button className="pl-4 pr-4 h-13 font-medium text-sm font-mono text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800  ease-in-out duration-150 hover:cursor-pointer">Landing Page</button>
                        </Link></> : 
                        <>
                            <Link to={"/dashboard"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Home
                                </button>
                            </Link>
                            <Link to={"/log"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Log
                                </button>
                            </Link>
                            <Link to={"/stats"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Stats
                                </button>
                            </Link>
                            <Link to={"/goals"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Goals
                                </button>
                            </Link>
                            
                            <Select items={[{name: "New Habit", id: 0}, {name: "New Goal", id: 1}]}
                                    selectedItem={null}
                                    setSelectedItem={(id: number) => {
                                        if(id == 0){
                                            navitgate("/create")
                                        }else{
                                            navitgate("/creategoal")
                                        }
                                    }}
                                    setText="Create"
                                    style="flex justify-end items-center h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer"/>

                            <Select items={[{name: "Settings", id: 0}, {name: "Log Out", id: 1}]}
                                    selectedItem={null}
                                    setSelectedItem={(id: number) => {
                                        if(id == 0){
                                            navitgate("/settings")
                                        }else{
                                            logout()
                                        }
                                    }}
                                    setText={loading? <AiOutlineLoading className="animate-spin"/> : <FaRegUserCircle size={14}/>}
                                    style="flex justify-end items-center h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 font-medium text-sm font-mono text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer"/>
                        </>
                    }
                </div>
            </div>
        </>
    )
}
