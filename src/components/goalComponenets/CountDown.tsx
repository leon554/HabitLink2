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
import ButtonComp from "../primatives/ButtonComp"
import { TbClock } from "react-icons/tb";
import { TbClockExclamation } from "react-icons/tb";

export default function CountDown() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    
    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)
    const [timeLeft, setTimeLeft] = useState((HC.getCurrentGoal()?.completionDate ?? 0) - Date.now());
    const startTime = new Date(HC.getCurrentGoal()!.created_at).getTime()
    const completionTime = HC.getCurrentGoal()?.completionDate ?? 0

    useEffect(() => {

        function calcTime(){
            setTimeLeft(completionTime - Date.now());
        }

        calcTime()
        const intervalID = setInterval(calcTime, 1000);

        return () => clearInterval(intervalID);
    }, [HC.getCurrentGoal]);

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
            <div className='bg-panel1  shadow-md shadow-gray-200 dark:shadow-none outline-border outline-1 w-[90%] max-w-[600px] p-7 py-6 flex gap-3.5 flex-col  rounded-2xl '>
                <ProgressPanel 
                    title={timeLeft <= 0 ? "Time Has Ran Out!" : "Time Progress"}
                    icon={timeLeft <= 0 ? <TbClockExclamation /> : <TbClock /> }
                    text={`Remaining Time: ${ dateUtils.formatTime(timeLeft)}`}
                    value={(1 - (timeLeft)/(completionTime - startTime)) * 100} roundTo={2}
                    large={true} />
                {HC.getCurrentGoal()!.type == HabitTypeE.Normal && HC.getCurrentGoal()!.linkedHabit ===  null? 
                    "" : 
                    <GoalProgress/>
                }
                {timeLeft <= 0 ? 
                    <div className="mt-5">
                        <DeleteArchiveGoal/>
                    </div>
                : ""}
                {HC.getCurrentGoal()?.type == HabitTypeE.Normal && HC.getCurrentGoal()?.linkedHabit == null?
                    <ButtonComp
                        name={"Complete Goal"}
                        onSubmit={() => completeGoal()}
                        highlight={false}
                        style="w-full mt-4"/>
                :
                !HC.getCurrentGoal()?.linkedHabit ? 
                    <div className="flex gap-3 justify-end mt-4  ">
                            <ButtonComp
                                name={"Log Progress"}
                                onSubmit={() => setOpen(true)}
                                highlight={false}
                                style="w-full"/>
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
                        <ButtonComp
                            name={!HC.loading ?  "Log" : <AiOutlineLoading className="animate-spin" />}
                            onSubmit={() => updateCurrentValue()}
                            highlight={true}
                            small={true}
                            style="w-full"
                            noAnimation={true}/>
                        <ButtonComp
                            name={"Exit"}
                            onSubmit={() => setOpen(false)}
                            highlight={true}
                            small={true}
                            style="w-full"
                            noAnimation={true}/>
                    </div>
                </div>
            </Model>
        </>
    )
}
