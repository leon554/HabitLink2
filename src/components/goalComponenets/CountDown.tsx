import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Providers/UserProvider"
import { AlertContext } from "../Alert/AlertProvider"
import Model from "../InputComponents/Model"
import { AiOutlineLoading } from "react-icons/ai"
import { HabitTypeE } from "../../utils/types"

export default function CountDown() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)
    const [timeLeft, setTimeLeft] = useState((HC.currentGaol?.completionDate ?? 0) - Date.now());

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
            <div className='bg-gray-100 text-gray-950  drop-shadow-sm outline-gray-700 outline-1 w-[90%] max-w-[600px] p-5 py-8 flex gap-1 flex-col items-center rounded-2xl'>
                <p className="text-gray-700">
                    Times Running Out!
                </p>
                <div className="flex items-center gap-1">
                    <p className="text-3xl text-blue-700">[</p>
                    <p className="text-3xl mt-0.5 text-gray-950">
                        {formatTime(timeLeft)}
                    </p>
                    <p className="text-3xl text-blue-700">]</p>
                </div>
                {HC.currentGaol?.type == HabitTypeE.Normal ?
                    <button className="bg-blue-300 text-sm flex-grow-10  mt-3 text-gray-900 p-1 px-3 rounded-lg hover:cursor-pointer hover:bg-blue-400 transition-all duration-150 ease-in-out"
                    onClick={() => completeGoal()}>
                        Complete Goal
                    </button>
                :
                !HC.currentGaol?.linkedHabit ? 
                    <div className="flex gap-3 justify-stretch mt-3">
                            <button className="bg-blue-300 text-sm flex-grow-10 text-gray-900 outline-1 p-1 px-3 rounded-lg hover:cursor-pointer hover:bg-blue-400 transition-all duration-150 ease-in-out"
                                onClick={() => {
                                    setOpen(true)
                                }}>
                                Log Progress
                            </button>
                    </div>
                : 
                <p className="text-gray-700 mt-1">
                    Log your linked habit
                </p>}
            </div>
            <Model open={open} onClose={() => setOpen(false)} top={true} fit={false}>
                <div className="flex flex-col items-center m-5 gap-4 w-[90%] max-w-[400px] p-4 rounded-2xl  bg-gray-100 ">
                    <p className="text-lg">Enter Value</p>
                    <input type="text" 
                            className="border-0 outline-1 w-full outline-stone-700 rounded-xl p-1 px-3 text-sm" 
                            placeholder={"Enter value to log..."}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}/>
                    <div className="flex w-full gap-2">
                        <button className="bg-blue-300 text-sm flex-grow-10 text-gray-900 outline-1 p-1  hover:bg-blue-400 px-3 h-7 flex justify-center rounded-xl hover:cursor-pointer "
                            onClick={() => updateCurrentValue()}>
                            {!HC.loading ?  "Log" : <AiOutlineLoading className="animate-spin" />}
                        </button>
                        <button className="bg-blue-300 text-sm flex-grow-3 text-stone-900 outline-1 hover:bg-blue-400 p-1 px-3 h-7 rounded-xl hover:cursor-pointer " 
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
