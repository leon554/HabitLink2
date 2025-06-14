import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Providers/UserProvider"
import { AlertContext } from "../Alert/AlertProvider"
import Model from "../InputComponents/Model"
import { AiOutlineLoading } from "react-icons/ai"

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
        await HC.updateCurrentValueGoal(Number(value), true)
        setOpen(false)
    } 

    return (
        <div className='text-stone-300 bg-stone-800 w-[90%] max-w-[600px] p-5 py-8 flex gap-1 flex-col items-center font-mono'>
            <p className="text-stone-400">
                Times Running Out!
            </p>
            <div className="flex items-center gap-1">
                <p className="text-3xl text-green-400">[</p>
                <p className="text-3xl mt-0.5 text-stone-400">
                    {formatTime(timeLeft)}
                </p>
                <p className="text-3xl text-green-400">]</p>
            </div>
            <div className="flex gap-3 justify-stretch mt-3">
                    <button className="bg-green-400 text-sm flex-grow-10 text-stone-800 p-1 px-3 rounded-md hover:cursor-pointer hover:rounded-lg transition-all duration-150 ease-in-out"
                        onClick={() => {
                            setOpen(true)
                        }}>
                        Log Progress
                    </button>
            </div>
            <Model open={open} onClose={() => setOpen(false)} top={true}>
                <div className="flex flex-col items-center m-5 gap-4 w-full">
                    <p className="text-lg">Enter Value</p>
                    <input type="text" 
                           className="border-0 outline-1 w-full outline-stone-700 rounded-md p-1 px-3 text-sm" 
                           placeholder={"Enter value to log..."}
                           value={value}
                           onChange={(e) => setValue(e.target.value)}/>
                    <div className="flex w-full gap-2">
                        <button className="bg-green-400 text-sm flex-grow-10 text-stone-800 p-1 px-3 h-7 flex justify-center rounded-md hover:cursor-pointer "
                            onClick={() => updateCurrentValue()}>
                            {!HC.loading ?  "Log" : <AiOutlineLoading className="animate-spin" />}
                        </button>
                        <button className="bg-green-400 text-sm flex-grow-3 text-stone-800 p-1 px-3 h-7 rounded-md hover:cursor-pointer " 
                            onClick={() => setOpen(false)}>
                            Exit
                        </button>
                    </div>
                </div>
            </Model>
        </div>
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
