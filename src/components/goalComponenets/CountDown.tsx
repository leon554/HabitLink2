import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Providers/UserProvider"
import { AlertContext } from "../Alert/AlertProvider"
import Model from "../InputComponents/Model"
import { AiOutlineLoading } from "react-icons/ai"
import { HabitTypeE } from "../../utils/types"
import DeleteArchiveGoal from "./DeleteArchiveGoal"
import ProgressPanel from "./ProgressPanel"
import GoalProgress from "./GoalProgress"
import { dateUtils } from "@/utils/dateUtils"

export default function CountDown() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    
    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)
    const [timeLeft, setTimeLeft] = useState((HC.currentGaol?.completionDate ?? 0) - Date.now());
    const startTime = new Date(HC.currentGaol!.created_at).getTime()
    const completionTime = HC.currentGaol?.completionDate ?? 0

    useEffect(() => {

        function calcTime(){
            setTimeLeft(completionTime - Date.now());
        }

        calcTime()
        const intervalID = setInterval(calcTime, 1000);

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
        alert(`Well done you completed you goal with ${ dateUtils.formatTime(timeLeft)} left 🎉🎉🎉🎉🎉`)
    }

    return (
        <>
            <div className='bg-panel1  drop-shadow-sm outline-border outline-1 w-[90%] max-w-[600px] p-7 py-7 flex gap-1 flex-col  rounded-2xl '>
                <ProgressPanel 
                    title={timeLeft <= 0 ? "Time Has Ran Out!" : "Time Progress"}
                    text={`Remaining Time: ${ dateUtils.formatTime(timeLeft)}`}
                    value={(1 - (timeLeft)/(completionTime - startTime)) * 100} roundTo={2}
                    large={true} />
                {HC.currentGaol!.type == HabitTypeE.Normal && HC.currentGaol!.linkedHabit ===  null? 
                    "" : 
                    <GoalProgress/>
                }
                {timeLeft <= 0 ? 
                    <div className="mt-5">
                        <DeleteArchiveGoal/>
                    </div>
                : ""}
                {HC.currentGaol?.type == HabitTypeE.Normal && HC.currentGaol.linkedHabit == null?
                    <button className="text-sm w-full text-subtext2 outline-1 outline-border2 p-1.5  px-3 rounded-xl hover:cursor-pointer transition-all duration-150 ease-in-out hover:bg-panel2 mt-4"
                    onClick={() => completeGoal()}>
                        Complete Goal
                    </button>
                :
                !HC.currentGaol?.linkedHabit ? 
                    <div className="flex gap-3 justify-end mt-4  ">
                            <button className="text-sm w-full text-subtext2 outline-1 outline-border2 p-1.5  px-3 rounded-xl hover:cursor-pointer transition-all duration-150 ease-in-out hover:bg-panel2"
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
