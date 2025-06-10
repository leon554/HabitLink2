import { useContext, useEffect, useState} from "react";
import Select from "../components/InputComponents/Select";
import { UserContext } from "../components/Providers/UserProvider";
import ConsistencyPanel from "../components/StatsComponents/ConsistencyPanel";
import Summary from "../components/StatsComponents/Summary";
import { HabitUtil } from "../utils/HabitUtil";
import { Util } from "../utils/util";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import CompletionThisWeek from "../components/StatsComponents/CompletionThisWeek";


export default function StatsPage() {
    const HC = useContext(UserContext)

    const [rank, setRank] = useState(HabitUtil.getRank(HC.currenthabitStats.strength))

    useEffect(() => {
        setRank(HabitUtil.getRank(HC.currenthabitStats.strength))
    }, [HC.currenthabitStats.strength])
    return (
        <div className="flex justify-center">
            {!HC.currentHabit ?
                <div className="flex mt-30 items-center  flex-col gap-5 rounded-md bg-stone-800 w-[90%] max-w-[600px] pb-8">
                    <p className="text-3xl font-mono text-center font-semibold text-stone-300 p-5 ">
                        Select a habit to see your stats!
                    </p>
                    <Select habits={Array.from(HC.habits.values())} 
                            selectedHabit={HC.currentHabit} 
                            setSelectedHabit={HC.setCurrentHabit}/>
                </div>
            : 
            <div className="w-full flex justify-center gap-4 "> 
                <div className="mt-20 gap-3 flex flex-col items-center w-[90%] max-w-[600px]">
                    <div className="rounded-md bg-stone-800 w-full p-4 flex justify-between items-center">
                        <img src={rank} alt="" className="w-7"/>
                        <p className="text-xl text-center font-mono text-stone-300">
                            {Util.capitilizeFirst(HC.currentHabit?.name)} Statistics
                        </p>
                        <div className="text-stone-500 hover:cursor-pointer flex relative">
                            <Select habits={Array.from(HC.habits.values())} 
                                                    selectedHabit={HC.currentHabit} 
                                                    setSelectedHabit={HC.setCurrentHabit}
                                                    setText={HiOutlineSwitchHorizontal}
                                                    style="outline-0 p-0 justify-end flex "/>
                        </div>
                    </div>
                    <ConsistencyPanel compRate={HC.currenthabitStats.compRate} strength={HC.currenthabitStats.strength}/>
                    <Summary habitType={HC.currentHabit.type} validComps={HC.currenthabitStats.validComps} partialComps={HC.currenthabitStats.partialComps} streak={HC.currenthabitStats.streak}
                        entries={HC.currenthabitStats.entries ? HC.currenthabitStats.entries : 0} missedComps={Math.max(HC.currenthabitStats.missedSessions - 1, 0)} dataSum={HC.currenthabitStats.dataSum}/>
                    <CompletionThisWeek/>
                </div>
            </div>
            }
        </div>
    )
}
