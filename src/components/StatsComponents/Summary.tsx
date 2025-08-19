import InfoBox from "./InfoBox";
import { HabitTypeE } from "../../utils/types";
import { UserContext } from "../Providers/UserProvider";
import { useContext, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import Model from "../InputComponents/Model";
import { TbChartCandle } from "react-icons/tb";

export default function Summary() {

    const [open, setOpen] = useState(false)
    const {habitStats, currentHabit} = useContext(UserContext)
    const p = habitStats.get(currentHabit!.id)!

    return (
        <div className="w-full relative bg-panel1 rounded-2xl font outline-1 outline-border text-title justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4">
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-panel2 text-subtext2 outline-1 outline-border2 p-1.5 rounded-lg">
                        <TbChartCandle/>
                    </div>
                    <p className="text-title font-semibold leading-none pb-1">
                        Overview
                    </p>
                </div>
                <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer " onClick={() => {
                    setOpen(true)
                }}/>
            </div>
            <div className="gap-3 gap-x-14 grid-cols-2 max-sm:grid-cols-1 grid  items-stretch w-full">
                <InfoBox value={`${p?.streak ?? 0}`} text="Current Streak" toolTipText="This is the current streak of your habit"/>
                <InfoBox value={`${Math.abs(p.validComps- p.completions)}`} text="Unscheduled Completions" toolTipText="This is the total number of times you've completed a habit, regardless of the day. For non-normal habits, only completions that met the goal are counted."/>
                <InfoBox value={`${Math.round((p.missedSessions + p.validComps) === 0 ? 0 : (p.missedSessions / (p.missedSessions + p.validComps)) * 100)}%`} text="Miss Rate" toolTipText="This is the percentage of scheduled days that for the current habit that were missed."/>
                <InfoBox value={`${p.validComps}`} text="Scheduled Completions" toolTipText="This is the number of times you've completed the current habit that met its goal and was done on one of the habit's scheduled completion days."/>
                <InfoBox value={`${p.completableDays}`} text="Completable Days" toolTipText="This is the number of scheduled days that could've/has bean completed since its creation"/>
                <InfoBox value={`${p.missedSessions}`} text="Missed Completions" toolTipText="This is the number of days the current habit was scheduled but had no recorded completion."/>

                {currentHabit?.type != HabitTypeE.Normal ? 
                    <>
                        <InfoBox value={`${Math.round(p.dataSum)}`} text={currentHabit?.type == HabitTypeE.Distance_Based ? 
                            "Total Km" :
                            currentHabit?.type == HabitTypeE.Iteration_Based ?
                            "Total Itterations" :
                            "Total Hours"} toolTipText="The sum of all the data logged for the current habit"/>
                        <InfoBox value={`${p.partialComps}`} text="Partial Completions" toolTipText="This is the number of days the current habit had atleast one entry but where the current habits goal wasnt reached"/>
                        <InfoBox value={`${Math.round(p.dataSum/(p.entries ?? 1)*10)/10}`} text={currentHabit?.type == HabitTypeE.Distance_Based ? 
                        "Avg Km/Entry" :
                        currentHabit?.type == HabitTypeE.Iteration_Based ?
                        "Avg Count/Entry" :
                        "Avg Hours/Entry"}
                        toolTipText="This is the average amount logged for each entry"/>
                        <InfoBox value={`${p.entries ?? 0}`} text="Total Entries" toolTipText="This counts the number of entries for the current habit. For example, if your goal is to walk 20 km a day and you log 10 km in the morning and 5 km in the afternoon, that would count as two separate entries."/>
                    </>
                : ""}
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="rounded-2xl bg-panel1 outline-1 gap-2 outline-border w-[80%] max-w-[500px] flex flex-col items-center p-8 font-sans">
                    <p className="text-xl text-title mb-2 mt-1">
                        Info
                    </p>
                    <ul className="mt-3 text-sm text-subtext1 flex flex-col gap-4 ">
                        <li className="text-justify">
                            <b>Current Sreak: </b>This is the current streak of your habit
                        </li>
                         <li className="text-justify">
                            <b>Valid Completions: </b>This is the number of times you've completed the current habit that met its goal, provided it wasn't a normal habit and was done on one of the habit's scheduled completion days.
                        </li>
                        <li className="text-justify">
                            <b>Total Completions: </b> This is the total number of times you've completed a habit, regardless of the day. For non-normal habits, only completions that met the goal are counted.
                        </li>
                         <li className="text-justify">
                            <b>Missed Completions: </b> This is the number of days the current habit was scheduled but had no recorded completion.
                        </li>
                         <li className="text-justify">
                            <b>Miss Rate: </b> This is the percentage of scheduled days that for the current habit that were missed.
                        </li>
                        <li className="text-justify">
                            <b>Completable Days: </b> This is the number of scheduled days that could've/has bean completed since its creation
                        </li>
                    </ul>
                    <button className="w-full bg-btn rounded-xl h-8 mt-2 text-btn-text hover:cursor-pointer">
                        Done
                    </button>
                </div>
            </Model>
        </div>
    )
}
