import { useContext, useEffect} from "react";
import { UserContext } from "../components/Providers/UserProvider";
import ConsistencyPanel from "../components/StatsComponents/ConsistencyPanel";
import Summary from "../components/StatsComponents/Summary";
import { Util } from "../utils/util";
import CompletionThisWeek from "../components/StatsComponents/CompletionThisWeek";
import CompletionsMonth from "../components/StatsComponents/CompletionsMonth";
import StatsTitle from "../components/StatsComponents/StatsTitle";
import MostCommonDays from "../components/Charts/MostCommonDays";
import { ConsistencyOverTime } from "@/components/Charts/ConsistencyOverTime";
import HabitEdit from "@/components/StatsComponents/HabitEdit";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import { AuthContext } from "@/components/Providers/AuthProvider";
import ToolTip from "@/components/ToolTip";
import FullCircleProgressBar from "@/components/InputComponents/FullCircleProgressBar";
import { triggerHaptic } from "tactus";
import CompsPerWeek from "@/components/DashboardComponenets/CompsPerWeek";
import SkipChart from "@/components/StatsComponents/SkipChart";
import ButtonComp from "@/components/primatives/ButtonComp";

export default function StatsPage() {
    const HC = useContext(UserContext)
    const auth = useContext(AuthContext)
    const navigate =  useNavigate()

    const compRate = HC.habitStats.get(HC.currentHabit?.id ?? 0)?.compRate ?? 0

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="flex justify-center">
            {!HC.currentHabit && Util.fetchAllMapItems(HC.habits).length != 0 ?
                <div className="flex flex-col w-full items-center gap-2.5 mb-15">
                    <div className="shadow-sm shadow-gray-200 dark:shadow-none  flex mt-20 items-center  flex-col gap-5 rounded-2xl bg-panel1 outline-1 outline-border w-[90%] max-w-[600px] p-4">
                        <p className="text-2xl text-center font-semibold text-title w-[90%]">
                            Select a habit!
                        </p>
                    </div>
                    <div className="flex flex-col gap-2.5 items-stretch w-[90%] max-w-[600px] ">
                        {Array.from(HC.habits.values()).map((h, i) => {
                            return(
                                <div key={i} className="shadow-sm shadow-gray-200 dark:shadow-none  flex items-center justify-between gap-3 text-subtext1 p-3 hover:text-stone-300 bg-panel1 border-1 border-border rounded-2xl grow-1 hover:cursor-pointer"
                                    onClick={() => {
                                        triggerHaptic()
                                        HC.setCurrentHabit(h)
                                    }}>
                                    <p className="font-medium text-subtext2 w-full">
                                        {h.icon} {Util.capitilizeFirst(h.name)}
                                    </p>
                                    <div className="flex gap-2.5">
                                        
                                         <div className="hover:cursor-pointer">
                                            <ToolTip tooltip={
                                                <div className="bg-panel1 rounded-2xl outline-1 outline-border p-2 flex flex-col items-center gap-2">
                                                    <p className="text-xs text-center text-subtext2">
                                                        Habit Consistency
                                                    </p>
                                                    <p className="text-sm font-medium text-subtext2">
                                                        {Math.round((HC.habitStats.get(h.id)?.compRate  ?? 0)*100)}%
                                                    </p>
                                                </div>
                                            }>
                                                <FullCircleProgressBar value={Math.round((HC.habitStats.get(h.id)?.compRate  ?? 0)*100)} size={30} fontsize={0} thickness={4}/>
                                            </ToolTip>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            : HC.isCalculating.current.isLoading() || auth.loading? 
            <AiOutlineLoading className="animate-spin text-subtext1 mt-25" size={30}/> :
            Util.fetchAllMapItems(HC.habits).length == 0 && !HC.currentHabit ? 
               <div className="shadow-md shadow-gray-200 dark:shadow-none w-[90%] max-w-[400px] bg-panel1 rounded-2xl outline-1 outline-border  p-7 flex flex-col gap-4 mt-18">
                    <p className="text-lg text-title font-medium leading-none">
                        No Habits :(
                    </p>
                    <p className="text-sm text-subtext3">
                        You currently have no habits, try adding a new habit and then comming back 💪
                    </p>
                    <div className="flex gap-3 w-full">
                        <ButtonComp
                            name={"New Habit"}
                            highlight={true}
                            onSubmit={() => {
                                navigate("/create")
                            }}
                            short={true}
                            style="w-full"/>
                        <ButtonComp
                            name={"Learn More"}
                            highlight={false}
                            onSubmit={() => {
                                navigate("/help")
                            }}
                            short={true}
                            style="w-full"/>
                    </div>
                </div>          
            :
            <div className="w-full flex justify-center gap-4 mb-15"> 
                <div className="mt-20 gap-3 flex flex-col items-center w-[90%] max-w-[600px]">
                    <StatsTitle/>
                    <ConsistencyPanel compRate={compRate} strength={HC.habitStats.get(HC.currentHabit!.id)?.strength ?? 0}/>
                    <Summary/>
                    <CompletionThisWeek/>
                    <CompletionsMonth/>
                    <div className={`flex flex-col  gap-3 w-full  `}>
                        <MostCommonDays habitId={HC.currentHabit!.id}/>
                        <ConsistencyOverTime/>
                        <div className="bg-panel1 outline-1 outline-border rounded-2xl">
                            <CompsPerWeek habitId={HC.currentHabit!.id}/>
                        </div>
                        <div className="bg-panel1 outline-1 outline-border rounded-2xl">
                            <SkipChart habitId={HC.currentHabit!.id} vertical={true}/>
                        </div>
                    </div>
                    <HabitEdit/>
                </div>
            </div>
            }
        </div>
    )
}
