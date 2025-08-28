import { useContext, useEffect, useState} from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
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
import { FaCheck } from "react-icons/fa";
import { useIsMobile } from "./Hooks/useIsMobile";
import { triggerHaptic } from "tactus";
import { useIsPwa } from "./Hooks/useIsPwa";




export default function Navbar() {
    const {session, logout, logOutLoading} = useContext(AuthContext)
    const [blurCreate, setBlurCreate] = useState(false)
    const [blurSettings, setBlurSettings] = useState(false)
    const navitgate = useNavigate()
    const screenWidth = useScreenWidth()
    const isMobile = useIsMobile()
    const location = useLocation()
    const isPwa = useIsPwa()

    useEffect(() => {

    }, [blurCreate])
    
    return (
        <>
            <div className={`dark:bg-panel1 bg-panel1 border-b-1 border-border dark:border-b-1 dark:border-border flex justify-between  items-stretch p-0 fixed ${isMobile && !["/", "/auth"].includes(location.pathname) ? `bottom-0 border-t-1 ${isPwa ? "h-18" : "h-13"}` : "top-0 h-13"}  left-0 w-full z-30`}>
                <div className="flex items-center gap-2">
                    {isMobile && !["/", "/auth"].includes(location.pathname) ?
                    null :
                    <>
                        <div className="flex items-center">
                            <p className=" text-gray-800 dark:text-neutral-100  text-xl font-mono ml-4">
                                HabitLink
                            </p>
                        </div>
                        <p className="text-xs text-subtext3">
                            (Beta 1.1)
                        </p>
                    </>
                    }
                </div>
                <div className={`${isMobile && !["/", "/auth"].includes(location.pathname) ? "flex w-full justify-center" : "flex"}`}>
                    { !session ? 
                        <>
                            <Link to={"/auth"}>
                                <button className="h-13 pl-4 pr-4 text-xs font-medium text-gray-800 dark:text-neutral-300 text-md hover:bg-blue-300 dark:hover:bg-green-500 hover:text-stone-800 ease-in-out duration-150 hover:cursor-pointer">
                                    Sign In
                                </button>
                            </Link>
                        </> : 
                        
                        screenWidth >= 500 ? 
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
                                <Select items={[{name: "Achievements", id: 3}, {name: "Help", id: 2}, {name: "Settings", id: 0}, {name: "Log Out", id: 1}]}
                                        largeText={false}
                                        selectedItem={null}
                                        setSelectedItem={(id: number) => {
                                            if(id == 0){
                                                navitgate("/settings")
                                            }else if(id == 1){
                                                logout()
                                            }else if(id == 3){
                                                navitgate("/achievements")
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
                            <div className={` flex justify-between ${isPwa ? "mb-3 w-[88%]" : "mb-1 w-[95%]"} `}>
                                <button className="hover:cursor-pointer flex justify-center items-center w-full" onClick={() => {
                                    triggerHaptic()
                                    navitgate("/dashboard")
                                }}>
                                    <FaHome className={` transition-all duration-150 ease-in-out ${location.pathname === "/dashboard" ? "text-highlight" : "text-title"}`}/>
                                </button>
                                <button className="hover:cursor-pointer flex justify-center items-center w-full" onClick={() => {
                                    triggerHaptic()
                                    navitgate("/log")
                                }}>
                                    <FaClipboard className={` transition-all duration-150 ease-in-out ${location.pathname === "/log" ? "text-highlight" : "text-title"}`}/>
                                </button>
                                <button className="hover:cursor-pointer flex justify-center items-center w-full" onClick={() => {
                                    triggerHaptic()
                                    navitgate("/stats")
                                }}>
                                    <IoStatsChart className={` transition-all duration-150 ease-in-out ${location.pathname === "/stats" ? "text-highlight" : "text-title"}`}/>
                                </button>
                                <button className="hover:cursor-pointer flex justify-center items-center w-full " onClick={() => {
                                    triggerHaptic()
                                    navitgate("/goals")
                                }}>
                                    <TbTargetArrow className={` transition-all duration-150 ease-in-out ${location.pathname === "/goals" ? "text-highlight" : "text-title"}`}/>
                                </button>
                                    <Select items={[
                                                {name: "New Habit", id: 3, icon: <FaPlus  size={15}/>},
                                                {name: "New Goal", id: 2, icon: <FaPlus  size={15}/>},
                                                {name: "Habit Studio", id: 9, icon: <FaPlus  size={15}/>},
                                                
                                                ]}
                                        selectedItem={null}
                                        largeText={true}
                                        dropUp={isMobile}
                                        blur={blurCreate}
                                        setBlur={setBlurCreate}
                                         center={true}
                                        onBtnClick={() => setBlurSettings(true)}
                                        setSelectedItem={(id: number) => {
                                            if(id == 2){
                                                navitgate("/creategoal")
                                            }
                                            if(id == 3){
                                                navitgate("/create")
                                            }  
                                            if(id == 9){
                                                navitgate("/studio")
                                            }
                                        }}
                                        origin={isMobile ? Origin.bottom: Origin.topRight}
                                        setText={logOutLoading? <AiOutlineLoading className="animate-spin"/> : <FaPlus size={16}/>}
                                        divStyles="w-full "
                                        style={` w-full transition-all duration-150 ease-in-out ${["/create", "/creategoal", "/studio"].includes(location.pathname)  ? "text-highlight" : "text-title"} flex justify-center items-center ${isPwa ? "h-14.5 " : "h-11.5"} max-md:text-xs text-sm text-md  ease-in-out duration-150 hover:cursor-pointer`}/>
                                <Select items={[
                                                {name: "Achievements", id: 10, icon: <FaCheck  size={15}/>},
                                                {name: "Help", id: 8, icon: <IoMdBookmarks  size={15}/>}, 
                                                {name: "Settings", id: 1, icon: <IoMdSettings  size={15}/>}, 
                                                {name: "Log Out", id: 0, icon: <IoLogOut  size={15}/>}, 
                                                ]}
                                        selectedItem={null}
                                        largeText={true}
                                        dropUp={isMobile}
                                        blur={blurSettings}
                                        setBlur={setBlurSettings}
                                        onBtnClick={() => setBlurCreate(true)}
                                       
                                        setSelectedItem={(id: number) => {
                                            if(id == 0){
                                                logout()
                                            }
                                            if(id == 1){
                                                navitgate("/settings")
                                            }
                                            if(id == 8){
                                                navitgate("/help")
                                            }
                                            if(id == 10){
                                                navitgate("/achievements")
                                            }
                                        }}
                                        divStyles="w-full"
                                        origin={isMobile ? Origin.bottomRight: Origin.topRight}
                                        setText={logOutLoading? <AiOutlineLoading className="animate-spin"/> : <IoMenu size={20}/>}
                                        style={` w-full transition-all duration-150 ease-in-out ${["/settings", "/help", "/achievements"].includes(location.pathname)  ? "text-highlight" : "text-title"} flex justify-center items-center ${isPwa ? "h-14.5 " : "h-11.5"} max-md:text-xs text-sm text-md  ease-in-out duration-150 hover:cursor-pointer`}/>
                            </div>
                        </> 
                                
                        
                    }
                </div>
            </div>
        </>
    )
}
