import { useContext} from "react";
import Select from "../components/InputComponents/Select";
import { UserContext } from "../components/Providers/UserProvider";
import ConsistencyPanel from "../components/StatsComponents/ConsistencyPanel";
import Summary from "../components/StatsComponents/Summary";

import { Util } from "../utils/util";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import CompletionThisWeek from "../components/StatsComponents/CompletionThisWeek";
import CompletionsMonth from "../components/StatsComponents/CompletionsMonth";


export default function StatsPage() {
    const HC = useContext(UserContext)
    //make habit calander so its from sunday first rown down
    return (
        <div className="flex justify-center">
            {!HC.currentHabit ?
                <div className="flex mt-20 items-center  flex-col gap-5 rounded-md bg-stone-800 w-[90%] max-w-[600px] pb-8">
                    <p className="text-2xl font-mono text-center font-semibold text-stone-300 mt-7  w-[90%]">
                        Select a habit to see your stats!
                    </p>
                    {HC.loading ? 
                        <p className="text-stone-400 font-mono mt-10">
                            Loading...
                        </p> : ""}
                    <div className="flex flex-col gap-2 items-stretch w-[90%] max-h-[600px] overflow-y-scroll no-scrollbar">
                        {Array.from(HC.habits.values()).map((h, i) => {
                            return(
                                <div key={i} className="flex items-center gap-3 text-stone-400 hover:text-stone-300 font-mono bg-stone-700/30 rounded-md grow-1 hover:cursor-pointer"
                                    onClick={() => HC.setCurrentHabit(h)}>
                                    <div className="w-2 h-10 bg-green-400 rounded-l-md"></div>
                                    <img src={HC.habitRanks.get(h.id)} className="h-4"/>
                                    <p>{Util.capitilizeFirst(h.name)}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            : 
            <div className="w-full flex justify-center gap-4 mb-15"> 
                <div className="mt-20 gap-3 flex flex-col items-center w-[90%] max-w-[600px]">
                    <div className="rounded-md bg-stone-800 w-full p-4 flex justify-between items-center">
                        <img src={HC.habitRanks.get(HC.currentHabit.id)} alt="" className="w-7"/>
                        <p className="text-xl text-center font-mono text-stone-300">
                            {Util.capitilizeFirst(HC.currentHabit?.name)} Statistics
                        </p>
                        <div className="text-stone-500 hover:cursor-pointer flex relative">
                            <Select items={Array.from(HC.habits.values())} 
                                                    selectedItem={HC.currentHabit} 
                                                    setSelectedItem={HC.setCurrentHabit}
                                                    setText={HiOutlineSwitchHorizontal}
                                                    style="outline-0 p-0 justify-end flex "/>
                        </div>
                    </div>
                    <ConsistencyPanel compRate={HC.currenthabitStats.compRate} strength={HC.currenthabitStats.strength}/>
                    <Summary habitType={HC.currentHabit.type} validComps={HC.currenthabitStats.validComps} partialComps={HC.currenthabitStats.partialComps} streak={HC.currenthabitStats.streak}
                        entries={HC.currenthabitStats.entries ? HC.currenthabitStats.entries : 0} missedComps={Math.max(HC.currenthabitStats.missedSessions, 0)} dataSum={HC.currenthabitStats.dataSum}/>
                    <CompletionThisWeek/>
                    <CompletionsMonth/>
                </div>
            </div>
            }
        </div>
    )
}
