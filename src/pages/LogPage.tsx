import { useContext, useState } from "react"
import { UserContext } from "../components/Providers/UserProvider"
import HabitLogCard from "../components/HabitLogCard"
import { HabitTypeE } from "../utils/types"
import Switch from "../components/InputComponents/Switch"
import { IoSettingsOutline } from "react-icons/io5";
import { HabitUtil } from "../utils/HabitUtil"
import { SettingsContext } from "../components/Providers/SettingsProvider"

export default function LogPage() {
    const [showSettings, setShowSettings] = useState(false)

    const user = useContext(UserContext)
    const {settings, setSettings} = useContext(SettingsContext)

    return (
        <div className="flex items-center flex-col h-screen pt-3 pb-7 ">   
            <div className="mt-18 w-[90%] max-w-[600px] bg-[#1b1b1b]">
                <div className=" mb-2 bg-stone-800 rounded-md flex justify-between items-center ">
                    <p className="  p-4 font-mono text-2xl text-stone-200">
                        Log Your Habits
                    </p>
                    <button className="text-stone-400 mr-3 p-1 rounded-md hover:cursor-pointer"
                        onClick={() => setShowSettings(!showSettings)}>
                        <IoSettingsOutline />
                    </button>
                </div>
            </div>
            {showSettings ? 
            <div className="w-[90%] max-w-[600px] bg-[#1b1b1b]">
                <div className="bg-stone-800 rounded-md  p-4 flex justify-center items-start mb-2 flex-col">
                    <p className="text-stone-200 font-mono text-lg font-normal text-center">
                        Habit Settings
                    </p>

                    <div className="flex justify-start w-[90%] mt-4 mb-2 flex-col gap-3">
                        <div className="flex items-center w-full gap-3 ">
                            <p className="text-stone-400 font-mono text-sm">
                                Show detailed habit info:
                            </p>
                            <Switch setStatus={(b: boolean) => setSettings({...settings, showDetails: b})} 
                                ticked={settings.showDetails} />
                        </div>

                        <div className="flex items-center w-full gap-3 ">
                            <p className="text-stone-400 font-mono text-sm">
                                Show normal habits only:
                            </p>
                            <Switch setStatus={(b: boolean) => setSettings({...settings, showNormal: b})} 
                                ticked={settings.showNormal} />
                        </div>

                        <div className="flex items-center w-full gap-3 ">
                            <p className="text-stone-400 font-mono text-sm">
                                Show only due habits:
                            </p>
                            <Switch setStatus={(b: boolean) => setSettings({...settings, showDue: b})} 
                                ticked={settings.showDue} />
                        </div>
                    </div>
                </div>
            </div>
            : ""}
            <div className="w-[90%] max-w-[600px] flex flex-col gap-2 overflow-auto no-scrollbar rounded-md bg-[#1b1b1b]">
                {Array.from(user.habits.values()).map((h, i) =>
                    h.type === HabitTypeE.Normal && (!settings.showDue || HabitUtil.isCompleteableToday(h, user.habitsCompletions.get(h.id))) ? (
                        <div className="w-full" key={`normal-${i}`}>
                            <HabitLogCard habit={h} detailed={settings.showDetails}/>
                        </div>
                    ) : null
                )}
                {Array.from(user.habits.values()).map((h, i) =>
                    h.type !== HabitTypeE.Normal && !settings.showNormal && (!settings.showDue || HabitUtil.isCompleteableToday(h, user.habitsCompletions.get(h.id))) ? (
                        <div className="w-full" key={`alt-${i}`}>
                            <HabitLogCard habit={h} detailed={settings.showDetails}/>
                        </div>
                    ) : null
                )}       
            </div>
        </div>
    )
}
