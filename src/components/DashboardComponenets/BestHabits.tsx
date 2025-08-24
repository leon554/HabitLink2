import { useContext, useState } from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { TbTrophy } from "react-icons/tb";
import { TbArrowBigDownLines } from "react-icons/tb";
import Select from "../InputComponents/Select";
import { useNavigate } from "react-router-dom";

interface Data{
    id: number
    name: string
    icon: string
    consistency: number
    strength: number
}
export default function BestHabits() {

    const HC = useContext(UserContext)
    const navigate = useNavigate()
    const [filter, setFilter] = useState(0)
    const items = [{name: "Both", id: 0}, {name: "Consistency", id: 1}, {name: "Strength", id: 2}]

    const habits = Util.fetchAllMapItems(HC.habits).map(h => {
        return {
            id: h.id,
            name: h.name,
            icon: h.icon,
            consistency: HC.habitStats.get(h.id)?.compRate ?? 0, 
            strength: HC.habitStats.get(h.id)?.strength  ?? 0
        }
    }).sort((a,b) => getProperData(b) - getProperData(a))


    function getProperData(data: Data){
        if(filter == 0){
            return data.consistency*100 + data.strength
        }else if(filter == 1){
            return data.consistency*100
        }else{
            return data.strength
        }
    }

    return (
        <div className="flex flex-col gap-3 m-7 my-6 h-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 mb-2">
                    <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                        <TbTrophy />
                    </div>
                    <p className="text-lg text-title font-semibold leading-none pb-1">
                        Best Habits
                    </p>
                </div>
                <div className="flex gap-1.5 items-center mb-2">
                     <Select items={items}
                            selectedItem={items[filter]} 
                            setSelectedItem={(id) => setFilter(id)}
                            style="shadow-sm shadow-gray-200 dark:shadow-none text-xs bg-panel2 text-subtext3 px-2 py-0.5 rounded-lg border-1 border-border2 z-10"/>
                    
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {habits.slice(0, 3).map((h, _) => {
                    return(
                        <div 
                            key={crypto.randomUUID()}
                            className= {`shadow-sm shadow-gray-200 dark:shadow-none h-[42px] bg-panel2 ${HC.isCalculating.current.isLoading() ? "animate-pulse" : ""} gap-2 px-2 rounded-xl border-1 hover:scale-99 transition-all duration-150 ease-in-out hover:cursor-pointer  flex justify-between items-center text-sm text-subtext2 py-2 border-b-1 border-border2  pb-3`}
                            onClick={() => {
                                HC.setCurrentHabit(HC.habits.get(h.id) ?? null)
                                navigate("/stats")
                            }}>
                            {HC.isCalculating.current.isLoading() ?
                                null :
                                <>
                                    <p className=" text-md truncate">
                                        {h.icon} {Util.capitilizeFirst(h.name)}
                                    </p>
                                    <p>

                                    </p>
                                    <div className="flex gap-2 items-center text-subtext3">
                                        <div className="flex gap-1 items-center">
                                            📈 
                                            <p className="text-xs w-8 ">
                                                {Math.round(h.consistency*100)}% 
                                            </p>
                                        </div>
                                        <div className="flex gap-0.5 items-center">
                                            💪 
                                            <p className="text-xs w-8 text-center">
                                                {`${Math.round(h.strength)}`}%
                                            </p>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    )
                })}
            </div>
            <div className=" h-full ">
                
                <div className="flex items-center gap-4 mb-1.5 mt-3.5 ">
                    <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 outline-1 outline-border2 text-subtext2  p-1.5 rounded-lg">
                        <TbArrowBigDownLines />
                    </div>
                    <p className="text-lg text-title font-semibold leading-none pb-1">
                        Worst Habits
                    </p>
                </div>
                {HC.habits.size < 6 ? 
                <div className="outline-1 h-[76%] outline-border2 rounded-xl mt-6 flex justify-center items-center">
                    <p className="text-subtext3 text-xs">
                        Create {6- HC.habits.size} more habits to see your worst habits
                    </p>
                </div>: 
                <div className="flex flex-col gap-2">
                    {habits.slice(-3).reverse().map((h, _) => {
                        return(
                            <div className={`shadow-sm shadow-gray-200 dark:shadow-none h-[42px] bg-panel2 ${HC.isCalculating.current.isLoading() ? "animate-pulse" : ""} px-2 rounded-xl border-1 hover:scale-99 transition-all duration-150 ease-in-out hover:cursor-pointer  flex justify-between items-center text-sm text-subtext2 py-2 border-b-1 border-border2 gap-2 pb-3`}
                                onClick={() => {
                                    HC.setCurrentHabit(HC.habits.get(h.id) ?? null)
                                    navigate("/stats")
                                }}>
                                {HC.isCalculating.current.isLoading() ?
                                    null :
                                    <>
                                        <p className=" text-md truncate">
                                            {h.icon} {Util.capitilizeFirst(h.name)}
                                        </p>
                                        <p>

                                        </p>
                                        <div className="flex gap-2 items-center text-subtext3">
                                            <div className="flex gap-1 items-center">
                                                📈 
                                                <p className="text-xs w-8 ">
                                                    {Math.round(h.consistency*100)}% 
                                                </p>
                                            </div>
                                            <div className="flex gap-0.5 items-center">
                                                💪 
                                                <p className="text-xs w-8 text-center">
                                                    {`${Math.round(h.strength)}`}%
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        )
                    })}
                </div>
                }
            </div>
        </div>
    )
}
