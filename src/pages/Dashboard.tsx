import {useContext} from "react"
import {AuthContext} from "../components/Providers/AuthProvider"
import { Util } from "../utils/util"
import ProgressPanel from "@/components/goalComponenets/ProgressPanel"
import { UserContext } from "@/components/Providers/UserProvider"
import { AiOutlineLoading } from "react-icons/ai"


export default function Dashboard() {
    const session = useContext(AuthContext)
    const HC = useContext(UserContext)

    const habits = Util.fetchAllMapItems(HC.habits)
    const avgHabitComp = Util.avgNumArr(Util.fetchAllMapItems(HC.habitComps)) * 100
    const avgHabitStrength = Util.avgNumArr(Util.fetchAllMapItems(HC.habitStrengths))

    return (
        <div className="flex flex-col items-center w-full mt-18 gap-5">
            <div className="  flex max-md:flex-col gap-5 justify-center max-md:items-center  md:w-[90%] max-md:w-full">
                <div className="flex flex-col gap-5 rounded-2xl  w-[90%] max-w-[600px] md:max-w-[400px]">
                    <div className="w-full bg-panel1 rounded-2xl outline-1 outline-border flex justify-center items-center p-5">
                        <p className="text-2xl font-medium text-title">
                            {session.localUser ? `Welecome Back, ${Util.capitilizeFirst(session.localUser?.name)}` : <AiOutlineLoading className="animate-spin"/>}
                        </p>
                    </div>
                    <div className="w-full  bg-panel1 rounded-2xl outline-1 outline-border p-7 flex flex-col gap-5">
                        <p className="text-title text-lg font-medium">
                            Progression
                        </p>
                        <ProgressPanel title="Average Habit Consistency" value={avgHabitComp} small={true}/>
                        <ProgressPanel title="Average Habit Strength" value={avgHabitStrength} small={true}/>
                        <ProgressPanel title="Average Goal Progress" value={45} small={true}/>
                    </div>
                </div>
                <div className=" max-md:h-50 rounded-2xl bg-panel1 w-[90%] max-w-[600px] outline-1 outline-border">
                    
                </div>
            </div>
            <div className="  flex max-md:flex-col gap-5 justify-center max-md:items-center  md:w-[90%] max-md:w-full">
                <div className="h-100  flex flex-col gap-5 rounded-2xl bg-panel1 w-[90%] max-w-[600px] md:max-w-[400px] outline-1 outline-border">
 
                </div>
                <div className=" h-100  rounded-2xl bg-panel1 w-[90%] max-w-[600px]  outline-1 outline-border">

                </div>
            </div>
        </div>
    )
}
