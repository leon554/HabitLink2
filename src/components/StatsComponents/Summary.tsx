import InfoBox from "./InfoBox";
import { HabitTypeE } from "../../utils/types";
import { UserContext } from "../Providers/UserProvider";
import { useContext, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import Model from "../InputComponents/Model";

export default function Summary() {

    const [open, setOpen] = useState(false)
    const {currentHabitStats: p, currentHabit} = useContext(UserContext)

    return (
        <div className="w-full relative bg-panel1 rounded-2xl font outline-1 font-mono outline-border text-title justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4">
            <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer absolute top-3 right-3" onClick={() => {
                setOpen(true)
            }}/>
            <div className="w-full">
                <p className="text-xl text-center mb-2 mt-1 font-medium">
                    Summary
                </p>
            </div>
            <div className="gap-3 grid-cols-2 grid  items-stretch w-full">
                <InfoBox value={`${p.streak}`} text="Current Streak"/>
                <InfoBox value={`${p.validComps}`} text="Valid Completions"/>
                <InfoBox value={`${p.completions}`} text="Total Completions"/>
                <InfoBox value={`${p.missedSessions}`} text="Missed Completions"/>
                <InfoBox value={`${p.completableDays}`} text="Completable Days"/>
                <InfoBox value={`${Math.round(p.missedSessions/(p.missedSessions + p.validComps) * 100)}%`} text="Miss Rate"/>

                {currentHabit?.type != HabitTypeE.Normal ? 
                    <>
                        <InfoBox value={`${p.entries}`} text="Total Entries"/>
                        <InfoBox value={`${p.partialComps}`} text="Partial Completions"/>
                        <InfoBox value={`${p.dataSum}`} text={currentHabit?.type == HabitTypeE.Distance_Based ? 
                            "Total Km" :
                            currentHabit?.type == HabitTypeE.Iteration_Based ?
                            "Total Itterations" :
                            "Total Hours"}/>
                        <InfoBox value={`${Math.round(p.dataSum/(p.entries ?? 1)*10)/10}`} text={currentHabit?.type == HabitTypeE.Distance_Based ? 
                        "Avg Km/Entry" :
                        currentHabit?.type == HabitTypeE.Iteration_Based ?
                        "Avg Count/Entry" :
                        "Avg Hours/Entry"}/>
                    </>
                : ""}
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="rounded-2xl bg-panel1 outline-1 gap-2 outline-border w-[80%] max-w-[500px] flex flex-col items-center p-8">
                    <p className="text-xl text-title mb-2 mt-1">
                        Info
                    </p>
                    <ul className="mt-3 text-[13px] text-subtext1 flex flex-col gap-4 ">
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
                            <b>Miss Rate: </b> This is the percentage of scheduled days for the current habit that were missed.
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
