import { useContext, useState } from "react"
import { UserContext } from "../components/UserProvider"
import HabitLogCard from "../components/HabitLogCard"
import { HabitTypeE } from "../utils/types"
import Switch from "../components/InputComponents/Switch"
import { IoSettingsOutline } from "react-icons/io5";
import { CompUtil } from "../utils/completionsUtil"

export default function LogPage() {
    const [showDetails, setShowDetails] = useState(true)
    const [showNormal, setShowNormal] = useState(false)
    const [showDue, setShowDue] = useState(false)
    const [settings, setSettings] = useState(false)

    const user = useContext(UserContext)

    return (
        <div className="flex items-center flex-col h-screen pt-3 pb-7">   
            <div className="mt-18 w-[90%] max-w-[600px] mb-2 bg-stone-800 rounded-md flex justify-between items-center">
                <p className="  p-4 font-mono text-2xl text-stone-200">
                    Log Your Habits
                </p>
                <button className="text-stone-400 mr-3 p-1 rounded-md hover:cursor-pointer"
                    onClick={() => setSettings(!settings)}>
                    <IoSettingsOutline />
                </button>
            </div>
            {settings ? 
            <div className="bg-stone-800 rounded-md w-[90%] max-w-[600px] p-4 flex justify-center items-start mb-2 flex-col">
                <p className="text-stone-200 font-mono text-lg font-normal text-center">
                    Habit Settings
                </p>

                <div className="flex justify-start w-[90%] mt-4 mb-2 flex-col gap-3">
                    <div className="flex items-center w-full gap-3 ">
                        <p className="text-stone-400 font-mono text-sm">
                            Show detailed habit info:
                        </p>
                        <Switch setStatus={setShowDetails} ticked={showDetails} />
                    </div>

                    <div className="flex items-center w-full gap-3 ">
                        <p className="text-stone-400 font-mono text-sm">
                            Show normal habits only:
                        </p>
                        <Switch setStatus={setShowNormal} ticked={showNormal} />
                    </div>

                    <div className="flex items-center w-full gap-3 ">
                        <p className="text-stone-400 font-mono text-sm">
                            Show only due habits:
                        </p>
                        <Switch setStatus={setShowDue} ticked={showDue} />
                    </div>
                </div>
            </div>
            : ""}
            <div className="w-[90%] max-w-[600px] flex flex-col gap-2 overflow-auto no-scrollbar rounded-md">
                {Array.from(user.habits.values()).map((h, i) =>
                    h.type === HabitTypeE.Normal && (!showDue || CompUtil.isCompleteableToday(h, user.habitsCompletions.get(h.id))) ? (
                        <div className="w-full" key={`normal-${i}`}>
                            <HabitLogCard habit={h} detailed={showDetails}/>
                        </div>
                    ) : null
                )}
                {Array.from(user.habits.values()).map((h, i) =>
                    h.type !== HabitTypeE.Normal && !showNormal && (!showDue || CompUtil.isCompleteableToday(h, user.habitsCompletions.get(h.id))) ? (
                        <div className="w-full" key={`alt-${i}`}>
                            <HabitLogCard habit={h} detailed={showDetails}/>
                        </div>
                    ) : null
                )}       
            </div>
        </div>
    )
}
