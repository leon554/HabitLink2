import { useContext, useState } from "react";
import { UserContext } from "../Providers/UserProvider";
import { Util } from "@/utils/util";
import { dateUtils } from "@/utils/dateUtils";
import type { HabitTypeE } from "@/utils/types";
import { IoInformationCircleOutline } from "react-icons/io5";
import Model from "../InputComponents/Model";
import { isMobile } from 'react-device-detect';
import { triggerHaptic } from "tactus";
import { TbClock24 } from "react-icons/tb";

export default function Timeline() {
    const HC = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [hoveredIndex2, setHoveredIndex2] = useState<number | null>(null);
    const [filter, setFilter] = useState(0)
    const [oneHourMs, setOneHourMs] = useState(1800000)

    const now = new Date();
    const startDay = new Date(now).setHours(0, 0, 0, 0);
    const endDay = new Date(now).setHours(23, 59, 59, 999);
    const totalDayMs = endDay - startDay;

    const completionsToday = Util.fetchAllMapItems(HC.habitsCompletions)
        .reduce((s, a) => s = [...s, ...a], [])
        .filter(c => new Date(Number(c.date)).getTime() >= startDay);

    return (
        <div className="m-7 my-6 flex flex-col gap-4 relative"
            onClick={() => setHoveredIndex(null)}>
            <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4 mb-2 mt-2">
                    <div className="bg-highlight/60 p-1.5 rounded-lg">
                        <TbClock24 />
                    </div>
                    <p className="text-lg text-title font-semibold leading-none pb-1">
                        Today's Timeline
                    </p>
                </div>
                <div className="flex gap-1.5">
                     <button className={`text-[11px] text-subtext3 hover:cursor-pointer pb-[3px] ${filter == 1 ? "border-b-1 border-highlight/40" : ""}`} 
                        onClick={() => {
                            triggerHaptic()
                            setFilter(1)
                        }}>
                        Zoom
                    </button>
                    <p className="text-[11px] text-border2">
                        |
                    </p>
                     <button className={`text-[11px] text-subtext3 hover:cursor-pointer pb-[3px] ${filter == 0 ? "border-b-1 border-highlight/40" : ""}`} 
                        onClick={() => {
                            triggerHaptic()
                            setFilter(0)
                        }}>
                        Information
                    </button>
                    <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer mt-[1px] ml-[1px]" onClick={() => {
                        setOpen(true);
                    }} />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <div className="relative h-4 w-full flex items-center">
                    <div className="w-full h-2 bg-progress-panel rounded-2xl"></div>
                   
                    {completionsToday.map((c, index) => {
                        return (
                            <div
                                className="absolute h-5 w-1 bg-highlight rounded-2xl hover:cursor-pointer group"
                                style={{ left: `${((Number(c.date) - startDay) / totalDayMs) * 100}%` }}
                                onMouseEnter={() => {
                                    if(!isMobile){
                                        setHoveredIndex(index)
                                    }
                                }} 
                                onMouseLeave={() => {
                                    if(!isMobile){
                                        setHoveredIndex(null)
                                    }
                                }} 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setHoveredIndex(prev => prev ? null : index)
                                }}
                                >
                                <div
                                    className={`p-2 px-4 bg-panel1 absolute left-1/2 transform -translate-x-1/2 bottom-5
                                    ${hoveredIndex === index ? 'scale-100 delay-200' : 'scale-0 delay-300'}
                                    transition-transform duration-200 ease-in-out rounded-2xl border-1 border-border`}
                                    
                                >
                                    {filter == 0 ?
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm text-subtext2 whitespace-nowrap">
                                                {Util.capitilizeFirst(HC.habits.get(c.habitId)?.name)}
                                            </p>
                                            <p className="text-subtext3 text-xs whitespace-nowrap mb-1 mt-1.5">
                                                Data: {Util.pretifyData(c.data, HC.habits.get(c.habitId)?.type as HabitTypeE)}
                                            </p>
                                            <p className="text-subtext3 text-xs whitespace-nowrap">
                                                {dateUtils.formatTo12HourTime(Number(c.date))}
                                            </p>
                                        </div>
                                    :
                                        <div className="flex flex-col w-40 p-2 px-0 gap-6 "
                                         onClick={e => e.stopPropagation()}>
                                           
                                            <div className="w-full h-1 bg-progress-panel rounded-2xl relative mt-2">
                                                {completionsToday.map((c1, i) => {
                                                    if(Math.abs(Number(c1.date) - Number(c.date)) <= oneHourMs/2){
                                                        const min = Number(c.date) - oneHourMs/2
                                                        return(
                                                            <div className="absolute h-4 w-1 bg-highlight rounded-2xl hover:cursor-pointer group/nested top-1/2 transform -translate-y-1/2"
                                                                style={{ left: `${(( (Number(c1.date) - min)) / oneHourMs) * 100}%` }}
                                                                onMouseEnter={() => setHoveredIndex2(i)} 
                                                                onMouseLeave={() => setHoveredIndex2(null)} 
                                                                onTouchStart={() => setHoveredIndex2(i)}
                                                                onTouchEnd={() => setHoveredIndex2(null)}>
                                                                {hoveredIndex2 === i && (
                                                                    <div
                                                                        className={`p-2 px-4 bg-panel1 absolute left-1/2 transform -translate-x-1/2 bottom-5
                                                                                    scale-100 transition-transform duration-200 ease-in-out rounded-2xl border-1 border-border`}
                                                                    >
                                                                            <div className="flex flex-col items-center">
                                                                                <p className="text-sm text-subtext2 whitespace-nowrap">
                                                                                    {Util.capitilizeFirst(HC.habits.get(c1.habitId)?.name)}
                                                                                </p>
                                                                                <p className="text-subtext3 text-xs whitespace-nowrap mb-1 mt-1.5">
                                                                                    Data: {Util.pretifyData(c1.data, HC.habits.get(c1.habitId)?.type as HabitTypeE)}
                                                                                </p>
                                                                                <p className="text-subtext3 text-xs whitespace-nowrap">
                                                                                    {dateUtils.formatTo12HourTime(Number(c1.date))}
                                                                                </p>
                                                                            </div>
                                                                    </div>
                                                                 )}
                                                            </div>                                                           
                                                        )
                                                    }
                                                })}
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="outline-1 outline-border2 w-full text-subtext3 rounded-md font-bold flex items-center font-mono justify-center hover:cursor-pointer" 
                                                    onClick={() => setOneHourMs(prev => prev * 2)}>
                                                    -
                                                </button>
                                                <button className="outline-1 outline-border2 w-full text-subtext3  rounded-md font-bold flex items-center font-mono justify-center hover:cursor-pointer" 
                                                    onClick={() => setOneHourMs(prev => prev / 2)}>
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                    <p className="text-subtext3 text-xs absolute top-7">
                        12am
                    </p>
                    <p className="text-subtext3 text-xs absolute top-7 left-1/2 transform -translate-x-1/2 origin-center">
                        12pm
                    </p>
                    <p className="text-subtext3 text-xs absolute top-7 right-0">
                        12am
                    </p>
                </div>
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="m-5 mx-7 flex flex-col gap-2 w-[80%] max-w-[600px] bg-panel1 rounded-2xl p-8" onClick={e => e.stopPropagation()}>
                    <p className="text-lg text-title font-medium">
                        Timeline Info
                    </p>
                    <p className="text-sm text-subtext2">
                        The timeline shows each habit entry throughout the day on a timeline. You can hover over each green line for more information about that specific entry.
                    </p>

                     <p className="text-sm text-subtext2">
                        There are two options "Information" and "Zoom" when the information mode is selected you can hover over entries and see information about them. When the zoom mode is selected you can over over entries and a new timeline will apear where you can zoom in and out on entries around the original entry you were hovering on.
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
