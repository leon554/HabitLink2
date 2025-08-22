import { useContext, useEffect, useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "./Providers/AuthProvider"
import { AiOutlineLoading } from "react-icons/ai";
import Select from "./InputComponents/Select";
import { FaRegUserCircle } from "react-icons/fa";
import { useScreenWidth } from "./Hooks/UseScreenWidth";
import { IoMenu } from "react-icons/io5";
import { Origin } from "@/utils/types";
import { FaHome } from "react-icons/fa";
import { FaClipboard } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { IoMdBookmarks } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";



export default function Navbar() {
    const {session, logout, logOutLoading} = useContext(AuthContext)
    const [blurCreate, setBlurCreate] = useState(false)
    const [blurSettings, setBlurSettings] = useState(false)
    const navitgate = useNavigate()
    const screenWidth = useScreenWidth()

    useEffect(() => {

    }, [blurCreate])
    
    return (
        <>
            <div className="dark:bg-panel1 bg-highlight border-b-1 border-border dark:border-b-1 dark:border-border flex justify-between h-13 items-stretch p-0 fixed top-0 left-0 w-full z-30">
                <div className="flex items-center gap-2">
                    <p className="ml-4 text-gray-800 dark:text-neutral-100  text-xl font-mono">
                        HabitLink
                    </p>
                    <p className="text-xs text-subtext3">
                        (Beta 1.1)
                    </p>
                </div>
                <div className="flex">
                    { !session ? 
                        <>
                            <Link to={"/auth"}>
                                <button className="h-13 pl-4 pr-4 text-xs font-medium text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Sign up
                                </button>
                            </Link>
                        </> : 
                        
                        screenWidth > 500 ? 
                        <>
                            <Link to={"/dashboard"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 text-sm  text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Home
                                </button>
                            </Link>
                            <Link to={"/log"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 text-sm  text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Log
                                </button>
                            </Link>
                            <Link to={"/stats"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 text-sm  text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Habits
                                </button>
                            </Link>
                            <Link to={"/goals"}>
                                <button className="h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 text-sm  text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Goals
                                </button>
                            </Link>
                            
                            <Select items={[{name: "New Habit", id: 0}, {name: "Habit Studio", id: 2}, {name: "New Goal", id: 1}]}
                                    selectedItem={null}
                                    largeText={false}
                                    setSelectedItem={(id: number) => {
                                        if(id == 0){
                                            navitgate("/create")
                                        }else if(id == 1){
                                            navitgate("/creategoal")
                                        }else{
                                            navitgate("/studio")
                                        }
                                    }}
                                    blur={blurCreate}
                                    setBlur={setBlurCreate}
                                    onBtnClick={() => setBlurSettings(true)}
                                    setText="Create"
                                    style="flex justify-end items-center h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 text-sm  text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer"/>
                                <Select items={[{name: "Settings", id: 0}, {name: "Help", id: 2}, {name: "Log Out", id: 1}]}
                                        largeText={false}
                                        selectedItem={null}
                                        setSelectedItem={(id: number) => {
                                            if(id == 0){
                                                navitgate("/settings")
                                            }else if(id == 1){
                                                logout()
                                            }else{
                                                navitgate("/help")
                                            }
                                        }}
                                        blur={blurSettings}
                                        setBlur={setBlurSettings}
                                        onBtnClick={() => setBlurCreate(true)}
                                        setText={logOutLoading? <AiOutlineLoading className="animate-spin"/> : <FaRegUserCircle size={14}/>}
                                        style="flex justify-end items-center h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 text-sm  text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer"/>
                        </> 
                        : 
                        <>
                            <Select items={[{name: "Home", id: 7, icon: <FaHome  size={15}/>},
                                            {name: "Log", id: 6, icon: <FaClipboard  size={15}/>},
                                            {name: "Habits", id: 5, icon: <IoStatsChart  size={15}/>},
                                            {name: "Goals", id: 4, icon: <TbTargetArrow  size={15}/>},
                                            {name: "New Habit", id: 3, icon: <FaPlus  size={15}/>},
                                            {name: "New Goal", id: 2, icon: <FaPlus  size={15}/>},
                                            {name: "Habit Studio", id: 9, icon: <FaPlus  size={15}/>},
                                            {name: "Help", id: 8, icon: <IoMdBookmarks  size={15}/>}, 
                                            {name: "Settings", id: 1, icon: <IoMdSettings  size={15}/>}, 
                                            {name: "Log Out", id: 0, icon: <IoLogOut  size={15}/>}, 
                                            ]}
                                    selectedItem={null}
                                    largeText={true}
                                    setSelectedItem={(id: number) => {
                                        if(id == 0){
                                            logout()
                                        }
                                        if(id == 1){
                                            navitgate("/settings")
                                        }
                                        if(id == 2){
                                            navitgate("/creategoal")
                                        }
                                        if(id == 3){
                                            navitgate("/create")
                                        }
                                        if(id == 4){
                                            navitgate("/goals")
                                        }
                                        if(id == 5){
                                            navitgate("/stats")
                                        }
                                        if(id == 6){
                                            navitgate("/log")
                                        }
                                        if(id == 7){
                                            navitgate("/dashboard")
                                        }
                                        if(id == 8){
                                            navitgate("/help")
                                        }
                                        if(id == 9){
                                            navitgate("/studio")
                                        }
                                    }}
                                    origin={Origin.topRight}
                                    setText={logOutLoading? <AiOutlineLoading className="animate-spin"/> : <IoMenu size={20}/>}
                                    style="flex justify-end items-center h-13 max-md:text-xs max-md:px-3 pl-4 pr-4 text-sm  text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer"/>
                        </> 
                                
                        
                    }
                </div>
            </div>
        </>
    )
}
