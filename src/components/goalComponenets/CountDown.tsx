import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Providers/UserProvider"
import { AlertContext } from "../Alert/AlertProvider"
import Model from "../InputComponents/Model"
import { AiOutlineLoading } from "react-icons/ai"
import { HabitTypeE } from "../../utils/types"
import useCurrentGoalValue from "../Hooks/useCurrentGoalValue"
import { Util } from "@/utils/util"
import DeleteArchiveGoal from "./DeleteArchiveGoal"

export default function CountDown() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    
    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)
    const [timeLeft, setTimeLeft] = useState((HC.currentGaol?.completionDate ?? 0) - Date.now());
    const startValue = HC.currentGaol?.startValue ?? 0
    let currentValue = useCurrentGoalValue()
    const targetValue = HC.currentGaol?.targetValue ?? 0

    useEffect(() => {
        const intervalID = setInterval(() => {
            setTimeLeft((HC.currentGaol?.completionDate ?? 0) - Date.now());
        }, 1000);

        return () => clearInterval(intervalID);
    }, [HC.currentGaol]);

    async function updateCurrentValue(){
        if(value == "") {alert("Enter something"); return}
        if(isNaN(Number(value))) {alert("Your input should only contain numbers"); setValue(""); return }
        await HC.addGoalCompletion(Number(value))
        setOpen(false)
    }
    async function completeGoal(){
        await HC.addGoalCompletion(1)
        alert(`Well done you completed you goal with ${formatTime(timeLeft)} left 🎉🎉🎉🎉🎉`)
    }

    return (
        <>
            <div className='bg-panel1  drop-shadow-sm outline-border outline-1 w-[90%] max-w-[600px] p-5 py-8 flex gap-1 flex-col items-center rounded-2xl '>
                <p className="text-subtext1">
                    {timeLeft <= 0 ? "Time Has Ran Out!" : "Times Running Out!"}
                </p>
                <div className="flex items-center gap-1">
                    <p className="text-3xl text-highlight">[</p>
                    <p className="text-3xl mt-0.5 text-title">
                        {formatTime(timeLeft)}
                    </p>
                    <p className="text-3xl text-highlight">]</p>
                </div>
                {timeLeft <= 0 ? 
                    <DeleteArchiveGoal/>
                : 
                <p className="text-center text-xs text-subtext3 max-w-70 mt-1">
                    {`You currently have ${Util.pretifyData(currentValue, HC.currentGaol?.type as HabitTypeE)}
                    logged with a goal of ${Util.pretifyData(targetValue, HC.currentGaol?.type as HabitTypeE)} 
                    ${(startValue != 0) ? " and a starting value of " + startValue : ""}`}
                </p>
                }
                {HC.currentGaol?.type == HabitTypeE.Normal && HC.currentGaol.linkedHabit == null?
                    <button className="bg-btn text-sm flex-grow-10  mt-3 text-btn-text p-1 px-3 rounded-lg hover:cursor-pointer transition-all duration-150 ease-in-out"
                    onClick={() => completeGoal()}>
                        Complete Goal
                    </button>
                :
                !HC.currentGaol?.linkedHabit ? 
                    <div className="flex gap-3 justify-stretch mt-3">
                            <button className="bg-btn text-sm flex-grow-10 text-btn-text outline-1 p-1 px-3 rounded-lg hover:cursor-pointer transition-all duration-150 ease-in-out"
                                onClick={() => {
                                    setOpen(true)
                                }}>
                                Log Progress
                            </button>
                    </div>
                : 
                ""}
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col items-center m-5 gap-4 w-[90%] max-w-[400px] p-8 rounded-2xl  bg-panel1 text-title"
                    onClick={(e) => e.stopPropagation()}>
                    <p className="text-lg leading-0 mb-4">Enter Value</p>
                    <input type="text" 
                            className="border-0 outline-1 w-full outline-border2 rounded-xl p-1 px-3 text-subtext1 text-sm" 
                            placeholder={"Enter value to log..."}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}/>
                    <div className="flex w-full gap-2">
                        <button className="bg-btn text-sm flex-grow-10 text-btn-text outline-1 p-1   px-3 h-7 flex justify-center rounded-xl hover:cursor-pointer "
                            onClick={() => updateCurrentValue()}>
                            {!HC.loading ?  "Log" : <AiOutlineLoading className="animate-spin" />}
                        </button>
                        <button className="bg-btn text-sm flex-grow-3 text-btn-text outline-1  p-1 px-3 h-7 rounded-xl hover:cursor-pointer " 
                            onClick={() => setOpen(false)}>
                            Exit
                        </button>
                    </div>
                </div>
            </Model>
        </>
    )
}
function formatTime(ms: number): string {
    if (ms <= 0) return "0d 00h 00m 00s";

    const totalSeconds = Math.floor(ms / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}
