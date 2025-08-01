import { useContext, useState } from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { dateUtils } from "@/utils/dateUtils";
import type { HabitTypeE } from "@/utils/types";
import { IoInformationCircleOutline } from "react-icons/io5"
import Model from "../InputComponents/Model";


export default function Timeline() {

    const HC = useContext(UserContext)
    const [open, setOpen] = useState(false)

    const now = new Date();
    const startDay = new Date(now).setHours(0, 0, 0, 0);
    const endDay = new Date(now).setHours(23, 59, 59, 999);
    const totalDayMs = endDay - startDay;

    const completionsToday = Util.fetchAllMapItems(HC.habitsCompletions)
        .reduce((s,a) => s = [...s, ...a], [])
        .filter(c => new Date(Number(c.date)).getTime() >= startDay)


    return (
        <div className="m-7 my-6 flex flex-col gap-4 relative">
            <p className="text-title text-lg font-medium">
                Todays Time Line
            </p>
            <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer absolute -top-3 -right-4" onClick={() => {
                setOpen(true)
            }}/>
            <div className="flex flex-col gap-1">
               <div className="relative h-4 w-full flex items-center">
                    <div className="w-full h-1 bg-progress-panel rounded-2xl"></div>
                    {completionsToday.map(c => {
                        return(
                            <div className="absolute h-4 w-1 bg-highlight rounded-2xl hover:cursor-pointer group"
                                style={{left: `${((Number(c.date) - startDay) / totalDayMs) * 100}%` }}>
                                <div className="p-2 px-4 bg-panel1 absolute left-1/2 transform -translate-x-1/2 bottom-5 scale-0 group-hover:scale-100 transition-transform duration-200 ease-in-out rounded-2xl border-1 border-border">
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm text-subtext2 whitespace-nowrap">
                                            {Util.capitilizeFirst(HC.habits.get(c.habitId)?.name)}
                                        </p>

                                        <p className="text-subtext3 text-xs whitespace-nowrap mb-1 mt-1.5">
                                            Data: {Util.pretifyData(c.data, HC.habits.get(c.habitId)?.type as HabitTypeE)}
                                        </p>
                                        <p className="text-subtext3 text-xs whitespace-nowrap" >
                                            {dateUtils.formatTo12HourTime(Number(c.date))}
                                        </p>

                                    </div>

                                </div>
                            </div>
                        )
                    })}
                    <p className="text-subtext3 text-xs absolute  top-7">
                        12am
                    </p>
                    <p className="text-subtext3 text-xs absolute  top-7 left-1/2 transform -translate-x-1/2 origin-center">
                        12pm
                    </p>
                    <p className="text-subtext3 text-xs absolute top-7 right-0">
                        12am
                    </p>
               </div>
            </div>
             <Model open={open} onClose={() => setOpen(false)}>
                <div className="m-5 mx-7 flex flex-col gap-2 w-[80%] max-w-[600px] bg-panel1 rounded-2xl p-8 " onClick={e => e.stopPropagation()}>
                    <p className="text-lg text-title font-medium">
                        Timeline Info
                    </p>
                    <p className="text-sm text-subtext2">
                        The timeline shows each habit entry throughout the day on a timeline. You can hover over each green line for more information about that specific entry.
                    </p>
                    <button className="bg-btn rounded-xl text-btn-text font-mono py-1 mt-5 hover:cursor-pointer"
                        onClick={() => setOpen(false)}>
                        Done
                    </button>
                </div>
            </Model>
        </div>
    )
}
