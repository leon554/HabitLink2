import { useContext, useState} from "react";
import FullCircleProgressBar from "./InputComponents/FullCircleProgressBar";
import { UserContext } from "./Providers/UserProvider";
import { Util } from "../utils/util";
import type { HabitTypeE } from "../utils/types";
import Model from "./InputComponents/Model";
import { AlertContext } from "./Alert/AlertProvider";
import { AiOutlineLoading } from "react-icons/ai";



export default function GoalProgress() {
    const [open, setOpen] = useState(false)
    const [add, setAdd] = useState(false)
    const [value, setValue] = useState("")

    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)
    const currenValue = HC.currentGaol?.currentValue ?? 0
    const targetValue = HC.currentGaol?.targetValue ?? 0
    
    async function updateCurrentValue(){
        if(value == "") {alert("Enter something"); return}
        if(isNaN(Number(value))) {alert("Your input should only contain numbers"); setValue(""); return }
        await HC.updateCurrentValueGoal(Number(value), add)
        setOpen(false)
    } 
    return (
        <div className="w-[90%] max-w-[600px] flex justify-center  gap-5  bg-stone-800 p-5 py-6 rounded-md text-stone-300 font-mono">
            <div>
                <FullCircleProgressBar value={Math.round(currenValue/targetValue*100)} size={120} fontsize={25} thickness={2}/>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-xl text-stone-300">
                    Progress
                </p>
                <p className="text-stone-400 mt-1 text-sm">
                    You currently have {Util.pretifyData(currenValue, HC.currentGaol?.type as HabitTypeE)} &#32;
                    logged with a goal of {Util.pretifyData(targetValue, HC.currentGaol?.type as HabitTypeE)}
                </p>
                <div className="flex gap-3 justify-stretch mt-3">
                     <button className="bg-green-400 text-sm flex-grow-1 text-stone-800 p-1 px-3 rounded-md  hover:cursor-pointer hover:rounded-lg transition-all duration-150 ease-in-out"
                        onClick={() => {
                            setAdd(false)
                            setOpen(true)
                        }}>
                        Set Value
                    </button>
                    <button className="bg-green-400 text-sm flex-grow-10 text-stone-800 p-1 px-3 rounded-md hover:cursor-pointer hover:rounded-lg transition-all duration-150 ease-in-out"
                        onClick={() => {
                            setAdd(true)
                            setOpen(true)
                        }}>
                        Add Value
                    </button>
                </div>
            </div>
            <Model open={open} onClose={() => setOpen(false)} top={true}>
                <div className="flex flex-col items-center m-5 gap-4 w-full">
                    <p className="text-lg">Enter Value</p>
                    <input type="text" 
                           className="border-0 outline-1 w-full outline-stone-700 rounded-md p-1 px-3 text-sm" 
                           placeholder={`${add ? "Enter value to add..." : "Enter value to set progress..."}`}
                           value={value}
                           onChange={(e) => setValue(e.target.value)}/>
                    <div className="flex w-full gap-2">
                        <button className="bg-green-400 text-sm flex-grow-10 text-stone-800 p-1 px-3 h-7 flex justify-center rounded-md hover:cursor-pointer "
                            onClick={() => updateCurrentValue()}>
                            {!HC.loading ? add ? "Add" : "Set" : <AiOutlineLoading className="animate-spin" />}
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
