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
import { TbChartHistogram, TbInfoCircle } from "react-icons/tb";
import ProgressPanel from "@/components/goalComponenets/ProgressPanel"
import CompsPerWeek from "@/components/DashboardComponenets/CompsPerWeek"
import SkipChart from "@/components/StatsComponents/SkipChart"
import MostCommonDays from "@/components/Charts/MostCommonDays" 
import HabitDistribution from "@/components/DashboardComponenets/HabitDistribution"
import MissVsCompChart from "@/components/DashboardComponenets/MissVsCompChart"
import { IoFlame } from "react-icons/io5"


export default function Dashboard() {
    const session = useContext(AuthContext);
    const HC = useContext(UserContext);
    const habitStats = Util.fetchAllMapItems(HC.habitStats);
    const tasksToday = Util.fetchAllMapItems(HC.habits).filter(h => HabitUtil.isDueToday(h, HC.habitsCompletions.get(h.id)))
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
        HC.habits.size == 0 || HC.goals.size == 0? 
            <div className="w-full flex flex-col items-center justify-center mt-17 gap-2">
                <div className="w-[90%] max-w-[600px] bg-panel1 rounded-2xl outline-1 outline-border flex justify-center items-center p-5">
                    <p className="text-2xl font-medium text-title">
                        {!session.loading ? `Welcome Back, ${Util.capitilizeFirst(session.localUser?.name)?.split(" ")[0]}` : <AiOutlineLoading className="animate-spin"/>}
                    </p>
                </div>
               <div className="w-[90%] max-w-[600px] bg-panel1 rounded-2xl outline-1 mb-10 outline-border mt-2 p-7 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-panel2 text-subtext2 outline-1 outline-border2 p-1.5 rounded-2xl">
                            <TbInfoCircle />
                        </div>
                        <p className="text-lg text-title font-semibold leading-none">Overview</p>
                    </div>
                    <p className="text-sm text-subtext3">New here? Build <strong>habits</strong>, link & associate them to your <strong>goals</strong>, and your progress and goal stataistics updates automatically.</p>
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-3 ">
                            <div className="rounded-xl bg-panel2 outline-1 outline-border2 p-4">
                                <p className="text-sm text-title font-semibold mb-1">Habits</p>
                                <p className="text-sm text-subtext3">Create and track recurring actions like “Go to the gym” or "Drink 8 glasses of water".</p>
                            </div>
                            <div className="rounded-xl bg-panel2 outline-1 outline-border2 p-4 flex flex-col gap-1">
                                <p className="text-sm text-title font-semibold mb-1">Goals</p>
                                <p className="text-sm text-subtext3 mb-3">Each goal should have at least one habit linked or associated. Progress comes from <strong>linked</strong> habits or manaul input.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl bg-panel2 outline-1 outline-border2 p-3">
                                        <p className="text-xs text-title font-semibold mb-1">Link a habit</p>
                                        <p className="text-[11px] text-subtext3">Completions automatically advance the goal.</p>
                                    </div>
                                    <div className="rounded-2xl bg-panel2 outline-1 outline-border2 p-3">
                                        <p className="text-xs text-title font-semibold mb-1">Associate a habit</p>
                                        <p className="text-[11px] text-subtext3">Counts toward stats only (consistency, strength).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden">
                            <div className="rounded-xl bg-panel2 outline-1 outline-border2 p-4">
                                <p className="text-sm text-title font-semibold mb-1">Link a habit</p>
                                <p className="text-xs text-subtext3">Habit completions automatically progress the goal.</p>
                            </div>
                            <div className="rounded-xl bg-panel2 outline-1 outline-border2 p-4">
                                <p className="text-sm text-title font-semibold mb-1">Associate a habit</p>
                                <p className="text-xs text-subtext3">Used for goal statistics (consistency, strength); no progress change.</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-title font-semibold">How it works</p>
                            <ul className="text-sm text-subtext3 list-disc pl-5 space-y-1">
                                <li>Create habits you want to build and improve.</li>
                                <li>Create goals and link and/or associate the relevant habit(s).</li>
                                <li>Track your habits consistently to create lasting habits and reach your goals.</li>
                            </ul>
                        </div>
                        <div className="rounded-xl bg-panel2 outline-1 outline-border2 p-4">
                            <p className="text-sm text-subtext3">
                                <strong>Example:</strong> Habit “Go to the gym”. Goal “Gym 30 times”. When the habit is <strong>linked</strong>, each log advances the goal. If only <strong>associated</strong>, it won’t change progress but contributes to stats like consistency and strength.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-1 items-center">
                            <button onClick={() => navigate("/create")} className="px-3 py-1.5 hover:cursor-pointer rounded-2xl bg-highlight text-black text-sm font-medium">Create a Habit</button>
                            <button onClick={() => navigate("/creategoal")} className="px-3 py-1.5 hover:cursor-pointer rounded-2xl bg-panel2 outline-1 outline-border2 text-subtext2 text-sm">Create a Goal</button>
                             <button onClick={() => navigate("/help")} className="px-3 py-1.5 hover:cursor-pointer rounded-2xl bg-panel2 outline-1 outline-border2 text-subtext2 text-sm">Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        : 
        <div className="flex flex-col items-center w-full mt-18 gap-5 mb-10 ">
                    <div className="w-full rounded-2xl flex justify-center items-center p-5 max-sm:p-2">
                        <p className="text-4xl max-sm:text-2xl font-bold text-title text-center">
                            {!session.loading ? `Welcome Back, ${Util.capitilizeFirst(session.localUser?.name)?.split(" ")[0]} 👋` : <AiOutlineLoading className="animate-spin"/>}
                        </p>
                    </div>
            <div className="  flex max-md:flex-col gap-5 justify-center max-md:items-center  md:w-[90%] max-md:w-full">
                <div className="rounded-2xl w-[90%] max-w-[600px] flex flex-col gap-5 md:max-w-[400px] h-102">
                    <div className="w-full flex flex-col gap-5 h-full">
                        <div className="rounded-2xl bg-panel1 outline-1 outline-border h-16 flex items-center justify-center">
                            <div className="flex  gap-3 items-center justify-around w-full mx-7">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 mt-[3px] bg-highlight rounded-full"></div>
                                    <p className="text-title text-lg font-medium">
                                        {HC.isCalculating.current.isLoading() ? 0 : tasksToday.length}
                                    </p>
                                    <p className="text-subtext2 text-xs ml-[-4px] ">
                                        Habit/s Due Today
                                    </p>
                                </div>
                                <div className="flex  items-center gap-3">
                                    <p className="text-title text-lg font-medium flex items-center gap-1.5">
                                        {<IoFlame className="text-highlight" size={16}/>} {HC.isCalculating.current.isLoading() ? 0 : Math.round(Util.avgNumArr(habitStats.map(s => s.streak)))} 
                                    </p>
                                    <p className="text-subtext2 text-xs ml-[-4px]">
                                        Avg Streak
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-panel1 p-7 py-6 rounded-2xl  outline-1 outline-border flex flex-col gap-5">
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
                    md:flex-row md:gap-5 md:justify-center md:items-start md:w-full md:max-w-[90%] w-full  md:mx-auto max-md:h-516">
                <div className="flex flex-col gap-5 flex-1 basis-0 min-w-0 max-w-[400px] max-md:w-[90%] max-md:max-w-[600px] ">
                    <div className="h-75 rounded-2xl relative">
                        <MostCommonDays />
                    </div>
                    <div className="h-85 rounded-2xl relative">
                        <SkipChart vertical={true} />
                    </div>
                    <div className="h-85 rounded-2xl relative">
                        <HabitDistribution  vertical={true}/>
                    </div>
                </div>
                <div className="flex flex-col gap-5 flex-1 basis-0 min-w-0 max-w-[600px]  max-md:w-[90%] ">
                    <div className="h-75 rounded-2xl bg-panel1 outline-1 outline-border relative">
                        <AvgCompRate />
                    </div>
                    <div className="h-85 rounded-2xl bg-panel1 outline-1 outline-border relative">
                        <CompsPerWeek />
                    </div>
                    <div className="h-85 rounded-2xl bg-panel1 outline-1 outline-border relative">
                        <MissVsCompChart/>
                    </div>
                </div>
            </div>
            <div className=" flex-1 min-w-0 rounded-2xl outline-1 outline-border relative w-[90%] max-w-[1020px] bg-panel1">
                <DashBoardStats />
            </div>
            
        </div>
    )
}
