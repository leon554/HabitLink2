import { useContext} from "react";
import { UserContext } from "../components/Providers/UserProvider";
import ConsistencyPanel from "../components/StatsComponents/ConsistencyPanel";
import Summary from "../components/StatsComponents/Summary";
import { Util } from "../utils/util";
import CompletionThisWeek from "../components/StatsComponents/CompletionThisWeek";
import CompletionsMonth from "../components/StatsComponents/CompletionsMonth";
import StatsTitle from "../components/StatsComponents/StatsTitle";
import MostCommonDays from "../components/Charts/MostCommonDays";
import { AreaChartStrength } from "@/components/Charts/AreaChartStrength";


export default function StatsPage() {
    const HC = useContext(UserContext)

    return (
        <div className="flex justify-center">
            {!HC.currentHabit ?
                <div className="flex mt-20 items-center  flex-col gap-5 rounded-2xl bg-panel1 outline-1 outline-border w-[90%] max-w-[600px] pb-8">
                    <p className="text-2xl font-mono text-center font-semibold text-title mt-7  w-[90%]">
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
                    <StatsTitle/>
                    <ConsistencyPanel compRate={HC.currentHabitStats.compRate} strength={HC.currentHabitStats.strength}/>
                    <Summary/>
                    <CompletionThisWeek/>
                    <CompletionsMonth/>
                    <MostCommonDays/>
                    <AreaChartStrength/>
                </div>
            </div>
            }
        </div>
    )
}
