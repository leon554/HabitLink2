import { useContext, useState } from "react"
import { UserContext } from "../components/Providers/UserProvider"
import HabitLogCard from "../components/HabitLogCard"
import { HabitTypeE } from "../utils/types"
import Switch from "../components/InputComponents/Switch"
import { IoSettingsOutline } from "react-icons/io5";
import { HabitUtil } from "../utils/HabitUtil"
import { SettingsContext } from "../components/Providers/SettingsProvider"
import { Util } from "@/utils/util"
import { useNavigate } from "react-router-dom"
import { triggerHaptic } from "tactus"
import ButtonComp from "@/components/primatives/ButtonComp"

export default function LogPage() {
    const [showSettings, setShowSettings] = useState(false)

    const user = useContext(UserContext)
    const navigate = useNavigate()
    const {settings, setSettings} = useContext(SettingsContext)

    return (
        <div className="flex items-center flex-col h-[97dvh] ">   
            <div className="mt-18 w-[90%] max-w-[600px] ">
                <div className=" mb-2 bg-panel1 dark:bg-panel1 dark:outline-border dark:text-title  drop-shadow-sm  outline-1 outline-border rounded-2xl text-title flex justify-between items-center ">
                    <p className="  p-4  text-2xl font-semibold">
                        Log Your Habits
                    </p>
                    <button className="text-title dark:text-title mr-3 p-1 rounded-md hover:cursor-pointer"
                        onClick={() => {
                            triggerHaptic()
                            setShowSettings(!showSettings)
                        }}>
                        <IoSettingsOutline />
                    </button>
                </div>
            </div>
            {showSettings ? 
            <div className="w-[90%] max-w-[600px]">
                <div className="bg-panel1 dark:bg-panel1 dark:outline-border drop-shadow-sm outline-1 outline-border rounded-2xl text-title dark:text-title p-4 flex justify-center items-start mb-2 flex-col">
                    <p className=" text-[19px]  text-center font-semibold">
                        Habit Settings
                    </p>

                    <div className="flex justify-start w-[90%] mt-4 mb-2 flex-col gap-3">
                        <div className="flex items-center w-full gap-3 ">
                            <p className="text-subtext1 dark:text-subtext2  text-sm">
                                Show detailed habit info:
                            </p>
                            <Switch setStatus={(b: boolean) => setSettings({...settings, showDetails: b})} 
                                ticked={settings.showDetails} />
                        </div>

                        <div className="flex items-center w-full gap-3 ">
                            <p className="text-subtext1 dark:text-subtext2  text-sm">
                                Show normal habits only:
                            </p>
                            <Switch setStatus={(b: boolean) => setSettings({...settings, showNormal: b})} 
                                ticked={settings.showNormal} />
                        </div>

                        <div className="flex items-center w-full gap-3 ">
                            <p className="text-subtext1 dark:text-subtext2  text-sm">
                                Show only due habits:
                            </p>
                            <Switch setStatus={(b: boolean) => setSettings({...settings, showDue: b})} 
                                ticked={settings.showDue} />
                        </div>
                    </div>
                </div>
            </div>
            : ""}
            {Util.fetchAllMapItems(user.habits).length == 0 ? 
            <div className="shadow-md shadow-gray-200 dark:shadow-none w-[90%] max-w-[600px] bg-panel1 rounded-2xl outline-1 outline-border mt-2 p-7 flex flex-col gap-4">
                <p className="text-lg text-title font-medium leading-none ">
                    No Habits :(
                </p>
                <p className="text-sm text-subtext3">
                    You currently have no habits to log try adding a new habit and then coming back 💪
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
            <div className="w-[90%] max-w-[600px] flex flex-col gap-2 overflow-auto no-scrollbar rounded-2xl ">
                {Array.from(user.habits.values()).map((h, i) =>
                    h.type === HabitTypeE.Normal && (!settings.showDue || HabitUtil.isDueToday(h, user.habitsCompletions.get(h.id))) ? (
                        <div className="w-full" key={`normal-${i}`}>
                            <HabitLogCard habit={h} />
                        </div>
                    ) : null
                )}
                {Array.from(user.habits.values()).map((h, i) =>
                    h.type !== HabitTypeE.Normal && !settings.showNormal && (!settings.showDue || HabitUtil.isDueToday(h, user.habitsCompletions.get(h.id))) ? (
                        <div className="w-full" key={`alt-${i}`}>
                            <HabitLogCard habit={h} />
                        </div>
                    ) : null
                )}       
                {user.habits.size < 5 ? 
                <div className="p-3 bg-panel1 border-1 border-border rounded-2xl shadow-md shadow-gray-200 dark:shadow-none mb-3 flex justify-between items-center">
                    <p className="text-subtext2 font-medium ">
                       🌱 Add new habit
                    </p>
                    <ButtonComp
                        name={"New Habit"}
                        highlight={false}
                        onSubmit={() => 
                            navigate("/create")
                        }
                        style="bg-panel2 rounded-xl"/>
                </div> : null}
            </div>
            }
        </div>
    )
}
