import {useContext, useEffect, useState} from "react"
import {AuthContext} from "../components/Providers/AuthProvider"
import { Util } from "../utils/util"
import ProgressPanel from "@/components/goalComponenets/ProgressPanel"
import { UserContext } from "@/components/Providers/UserProvider"
import { AiOutlineLoading } from "react-icons/ai"
import UpcomingGoals from "@/components/DashboardComponenets/UpcomingGoals"
import BestHabits from "@/components/DashboardComponenets/BestHabits"
import HabitCalander from "@/components/DashboardComponenets/HabitCalander"
import Timeline from "@/components/DashboardComponenets/Timeline"
import DashBoardStats from "@/components/DashboardComponenets/DashBoardStats"
import AvgCompRate from "@/components/DashboardComponenets/AvgCompRate"
import { useNavigate } from "react-router-dom"



export default function Dashboard() {
    const session = useContext(AuthContext);
    const HC = useContext(UserContext);
    const habitStats = Util.fetchAllMapItems(HC.habitStats);

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
                        {!session.loading ? `Welecome Back, ${Util.capitilizeFirst(session.localUser?.name)?.split(" ")[0]}` : <AiOutlineLoading className="animate-spin"/>}
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
            <div className="  flex max-md:flex-col gap-5 justify-center max-md:items-center  md:w-[90%] max-md:w-full">
                <div className="rounded-2xl w-[90%] max-w-[600px] flex flex-col gap-5 md:max-w-[400px] h-89">
                    <div className="w-full bg-panel1 rounded-2xl outline-1 outline-border flex justify-center items-center p-5">
                        <p className="text-2xl font-medium text-title">
                            {!session.loading ? `Welecome Back, ${Util.capitilizeFirst(session.localUser?.name)?.split(" ")[0]}` : <AiOutlineLoading className="animate-spin"/>}
                        </p>
                    </div>
                    <div className="w-full  bg-panel1 rounded-2xl outline-1 outline-border p-7 flex flex-col gap-5 h-full">
                        <p className="text-title text-lg font-medium">
                            Progression
                        </p>
                        <ProgressPanel title="Average Habit Consistency" value={isNaN(avgHabitComp) ? 0 : avgHabitComp} small={true} load={true}/>
                        <ProgressPanel title="Average Habit Strength" value={isNaN(avgHabitStrength) ? 0 : avgHabitStrength} small={true} load={true}/>
                        <ProgressPanel title="Average Goal Progress" value={isNaN(avgGoalProgress) ? 0 : avgGoalProgress} small={true} load={true}/>
                    </div>
                </div>
                <div className="h-89 rounded-2xl bg-panel1 w-[90%] max-w-[600px] outline-1 outline-border flex flex-col gap-5 ">
                    <UpcomingGoals/>
                </div>
            </div>
            <div className=" p-[1px] flex max-md:flex-col gap-5 justify-center max-md:items-center  md:w-[90%] max-md:w-full">
                <div className=" h-105  flex flex-col gap-5 rounded-2xl bg-panel1 w-[90%] max-w-[600px] md:max-w-[400px] outline-1 outline-border grow-1">
                    <BestHabits/>
                </div>
                <div className="rounded-2xl  w-[90%] max-w-[600px] flex flex-col gap-5">
                    <div className=" h-64 rounded-2xl bg-panel1  outline-1 outline-border relative">
                        <HabitCalander/>
                    </div>
                    <div className=" h-36 rounded-2xl bg-panel1  outline-1 outline-border relative">
                        <Timeline/>
                    </div>
                </div>
            </div>
            <div className="p-[1px] flex max-md:flex-col gap-5 justify-center max-md:items-center md:w-[90%] max-md:w-full">
                <div className="h-96 flex-1 min-w-0 flex flex-col gap-5 rounded-2xl bg-panel1  outline-1 outline-border w-[90%] max-w-[600px] md:max-w-[400px]">
                    <AvgCompRate />
                </div>

                <div className="sm:h-96 flex-1 min-w-0 rounded-2xl bg-panel1 outline-1 outline-border relative w-[90%] max-w-[600px] ">
                    <DashBoardStats />
                </div>
            </div>
        </div>
    )
}
