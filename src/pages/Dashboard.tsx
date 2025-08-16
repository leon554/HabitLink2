import {useContext, useEffect, useState} from "react"
import {AuthContext} from "../components/Providers/AuthProvider"
import { Util } from "../utils/util"
import { UserContext } from "@/components/Providers/UserProvider"
import { AiOutlineLoading } from "react-icons/ai"
import UpcomingGoals from "@/components/DashboardComponenets/UpcomingGoals"
import BestHabits from "@/components/DashboardComponenets/BestHabits"
import HabitCalander from "@/components/DashboardComponenets/HabitCalander"
import Timeline from "@/components/DashboardComponenets/Timeline"
import DashBoardStats from "@/components/DashboardComponenets/DashBoardStats"
import AvgCompRate from "@/components/DashboardComponenets/AvgCompRate"
import { useNavigate } from "react-router-dom"
import { HabitUtil } from "@/utils/HabitUtil"
import { TbChartHistogram } from "react-icons/tb";
import ProgressPanel from "@/components/goalComponenets/ProgressPanel"
import CompsPerWeek from "@/components/DashboardComponenets/CompsPerWeek"
import SkipChart from "@/components/StatsComponents/SkipChart"
import MostCommonDays from "@/components/Charts/MostCommonDays" 


export default function Dashboard() {
    const session = useContext(AuthContext);
    const HC = useContext(UserContext);
    const habitStats = Util.fetchAllMapItems(HC.habitStats);
    const tasksToday = Util.fetchAllMapItems(HC.habits).filter(h => HabitUtil.isCompleteableToday(h, HC.habitsCompletions.get(h.id)))
    const [avgHabitComp, setAvgHabitComp] = useState(0);
    const [avgHabitStrength, setAvgHabitStrength] = useState(0);
    const [avgGoalProgress, setAvgGoalProgress] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        const newAvgHabitComp = Util.avgNumArr(habitStats.map(h => h.compRate)) * 100;
        const newAvgHabitStrength = Util.avgNumArr(habitStats.map(h => h.strength));
        const newAvgGoalProgress = Util.avgNumArr(Util.fetchAllMapItems(HC.goalProgress));

        setAvgHabitComp(newAvgHabitComp);
        setAvgHabitStrength(newAvgHabitStrength);
        setAvgGoalProgress(newAvgGoalProgress);
    }, [HC.habitStats, HC.goalProgress, HC.goals]); 


    return (
        Util.fetchAllMapItems(HC.habits).length == 0 ? 
            <div className="w-full flex flex-col items-center justify-center mt-17 gap-2">
                <div className="w-[90%] max-w-[600px] bg-panel1 rounded-2xl outline-1 outline-border flex justify-center items-center p-5">
                    <p className="text-2xl font-medium text-title">
                        {!session.loading ? `Welcome Back, ${Util.capitilizeFirst(session.localUser?.name)?.split(" ")[0]}` : <AiOutlineLoading className="animate-spin"/>}
                    </p>
                </div>
                <div className="w-[90%] max-w-[600px] bg-panel1 rounded-2xl outline-1 outline-border mt-2 p-7 flex flex-col gap-4">
                    <p className="text-lg text-title font-medium leading-none">
                        No Habits :(
                    </p>
                    <p className="text-sm text-subtext3">
                        You currently have no habits, try adding a new habit and then comming back 💪
                    </p>
                    <button className="w-full bg-btn rounded-xl py-1 text-btn-text font-medium text-sm hover:cursor-pointer" 
                        onClick={() => navigate("/create")}>
                        New Habit
                    </button>
                </div>
            </div>
        : 
        <div className="flex flex-col items-center w-full mt-18 gap-5 mb-10">
                    <div className="w-full rounded-2xl flex justify-center items-center p-5 max-sm:p-2">
                        <p className="text-4xl max-sm:text-2xl font-bold text-title text-center">
                            {!session.loading ? `Welcome Back, ${Util.capitilizeFirst(session.localUser?.name)?.split(" ")[0]} 👋` : <AiOutlineLoading className="animate-spin"/>}
                        </p>
                    </div>
            <div className="  flex max-md:flex-col gap-5 justify-center max-md:items-center  md:w-[90%] max-md:w-full">
                <div className="rounded-2xl w-[90%] max-w-[600px] flex flex-col gap-5 md:max-w-[400px] h-102">
                    <div className="w-full flex flex-col gap-5 h-full">
                        <div className="rounded-2xl bg-panel1 outline-1 outline-border h-16 flex items-center justify-center">
                            <div className="flex  gap-3 items-center">
                                <div className="h-2 w-2 bg-highlight rounded-full ">
                                <div className="h-2 w-2 bg-highlight rounded-full"></div>
                                </div>
                                <p className="text-title font-medium">
                                    {tasksToday.length} Habit To Do Today
                                </p>
                            </div>
                        </div>
                        <div className="bg-panel1 p-7 rounded-2xl  outline-1 outline-border flex flex-col gap-4.5">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="bg-panel2 text-subtext2 outline-1 outline-border2 p-1.5 rounded-lg">
                                    <TbChartHistogram />
                                </div>
                                <p className="text-lg text-title font-semibold leading-none pb-1">
                                    Progression
                                </p>
                            </div>
                            <ProgressPanel value={isNaN(avgHabitComp) ? 0 : avgHabitComp} title="Average Habit Consistency" small={true} load={true}/>
                            <ProgressPanel value={isNaN(avgHabitStrength) ? 0 : avgHabitStrength} title="Average Habit Strength" small={true} load={true}/>
                            <ProgressPanel value={100 - (isNaN(avgHabitComp) ? 0 : avgHabitComp)} title="Miss Rate" small={true} load={true}/>
                            <ProgressPanel value={isNaN(avgGoalProgress) ? 0 : avgGoalProgress} title="Average Goal Progress" small={true} load={true}/>
                        </div>
                    </div>
                </div>
                <div className="h-102 rounded-2xl bg-panel1 w-[90%] max-w-[600px] outline-1 outline-border flex flex-col gap-5 ">
                    <UpcomingGoals/>
                </div>
            </div>
            <div className={`p-[1px] flex max-md:flex-col gap-5 justify-center max-md:items-center  md:w-[90%] max-md:w-full`}>
                <div className=" h-114  flex flex-col gap-5 rounded-2xl bg-panel1 w-[90%] max-w-[600px] md:max-w-[400px] outline-1 outline-border grow-1">
                    <BestHabits/>
                </div>
                <div className="rounded-2xl  w-[90%] max-w-[600px] flex flex-col gap-5">
                    <div className=" h-73 rounded-2xl bg-panel1  outline-1 outline-border relative">
                        <HabitCalander/>
                    </div>
                    <div className=" h-36 rounded-2xl bg-panel1  outline-1 outline-border relative">
                        <Timeline/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-5 
                    md:flex-row md:gap-5 md:justify-center md:items-start md:w-full md:max-w-[90%] w-full  md:mx-auto max-md:h-335">
                {/* First column */}
                <div className="flex flex-col gap-5 flex-1 basis-0 min-w-0 max-w-[400px] max-md:w-[90%] max-md:max-w-[600px] ">
                    <div className="h-75 rounded-2xl relative">
                    <MostCommonDays />
                    </div>
                    <div className="h-80 rounded-2xl relative">
                    <SkipChart vertical={true} />
                    </div>
                </div>

                {/* Second column */}
                <div className="flex flex-col gap-5 flex-1 basis-0 min-w-0 max-w-[600px]  max-md:w-[90%] ">
                    <div className="h-75 rounded-2xl bg-panel1 outline-1 outline-border relative">
                    <AvgCompRate />
                    </div>
                    <div className="h-85 rounded-2xl bg-panel1 outline-1 outline-border relative">
                    <CompsPerWeek />
                    </div>
                </div>
            </div>
            <div className=" flex-1 min-w-0 rounded-2xl outline-1 outline-border relative w-[90%] max-w-[1020px] bg-panel1">
                <DashBoardStats />
            </div>
            
        </div>
    )
}
