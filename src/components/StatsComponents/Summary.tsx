import InfoBox from "./InfoBox";
import { HabitTypeE } from "../../utils/types";

interface Props{
    streak: number
    validComps: number
    partialComps: number
    missedComps: number
    dataSum: string
    entries: number
    habitType: string
}
export default function Summary(p: Props) {

    return (
        <div className="w-full bg-panel1 rounded-2xl font-mono outline-1 outline-border text-title justify-center p-7 pt-5 pb-7 flex flex-col items-center gap-4">
            <div className="w-full">
                <p className="text-lg text-center">
                    Summary
                </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-strech">
                <InfoBox value={`${p.streak}`} text="Current Streak"/>
                <InfoBox value={`${p.validComps}`} text="Total Completions"/>
                <InfoBox value={`${p.missedComps}`} text="Missed Completions"/>
                {p.habitType != HabitTypeE.Normal ? 
                    <>
                        <InfoBox value={`${p.entries}`} text="Total Entries"/>
                        <InfoBox value={`${p.partialComps}`} text="Partial Completions"/>
                        <InfoBox value={`${p.dataSum}`} text={p.habitType == HabitTypeE.Distance_Based ? 
                            "Total Km" :
                            p.habitType == HabitTypeE.Iteration_Based ?
                            "Total Itterations" :
                            "Total Hours"}/>
                    </>
                : ""}
            </div>
        </div>
    )
}
