import { useContext, useState } from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"


interface Data{
    name: string
    icon: string
    consistency: number
    strength: number
}
export default function BestHabits() {

    const HC = useContext(UserContext)
    const [filter, setFilter] = useState(0)
    const habits = Util.fetchAllMapItems(HC.habits).map(h => {
        return {
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
        <div className="flex flex-col gap-3 m-7">
            <div className="flex justify-between items-center">
                <p className="text-title text-lg font-medium">
                    Best Habits
                </p>
                <div className="flex gap-1.5">
                    <button className={`text-[11px] text-subtext3 hover:cursor-pointer pb-[3px] ${filter == 2 ? "border-b-1 border-border2" : ""}`} 
                        onClick={() => setFilter(2)}>
                        Strength
                    </button>
                    <p className="text-[11px] text-border2">
                        |
                    </p>
                     <button className={`text-[11px] text-subtext3 hover:cursor-pointer pb-[3px] ${filter == 1 ? "border-b-1 border-border2" : ""}`} 
                        onClick={() => setFilter(1)}>
                        Consistency
                    </button>
                    <p className="text-[11px] text-border2">
                        |
                    </p>
                     <button className={`text-[11px] text-subtext3 hover:cursor-pointer pb-[3px] ${filter == 0 ? "border-b-1 border-border2" : ""}`} 
                        onClick={() => setFilter(0)}>
                        Both
                    </button>
                </div>
            </div>
            <div>
                {habits.slice(0, 3).map(h => {
                    return(
                        <div className="flex justify-between items-center text-sm text-subtext1 py-2 border-b-1 border-border2 pb-3">
                            <p>
                                {h.icon} {Util.capitilizeFirst(h.name)}
                            </p>
                            <div className="flex gap-2 items-center">
                                <div className="flex gap-0.5 items-center">
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
                        </div>
                    )
                })}
            </div>
             <p className="text-title text-lg font-medium mt-5">
                Worst Habits
            </p>
            <div>
                {habits.slice(-3).map(h => {
                    return(
                        <div className="flex justify-between items-center text-sm text-subtext1 py-2 border-b-1 border-border2 pb-3">
                            <p>
                                {h.icon} {Util.capitilizeFirst(h.name)}
                            </p>
                             <div className="flex gap-1.5 items-center">
                                <div className="flex gap-0.5 items-center">
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
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
