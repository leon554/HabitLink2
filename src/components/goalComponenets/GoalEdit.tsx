import { useContext, useEffect, useRef, useState } from "react"
import Model from "../InputComponents/Model"
import DeleteArchiveGoal from "./DeleteArchiveGoal"
import { useScreenWidth } from "../Hooks/UseScreenWidth"
import { triggerHaptic } from "tactus"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { AiOutlineLoading } from "react-icons/ai"
import { AlertContext } from "../Alert/AlertProvider"
import type { HabitType } from "@/utils/types"
import { TiDelete } from "react-icons/ti"


export default function GoalEdit() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")

    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)
    const width = useScreenWidth()
    const loadingIndex = useRef(-1)

    const habits = Util.fetchMapItems<HabitType>(HC.goals.get(HC.currentGaol!)?.habits.split(",").map(i => Number(i)) ?? [], HC.habits)

    useEffect(() => {
        if(!HC.currentGaol) return
        setName(HC.goals.get(HC.currentGaol)!.name)
    }, [HC.currentGaol])

    async function updateName(name: string, goalId: number | undefined){
        if(!goalId || !HC.goals.has(goalId)) return alert("Parameters not filled in")

        const res = await HC.updateGoalName(name, goalId)

        if(!res.success){
            alert("Error" + res.message)
        }else{
            setName("")
            alert("Succes")
        }
    }

    return (
        <>
            <div>
                <button className={` bg-panel1 p-2 px-9 rounded-xl text-subtext3 outline-1  outline-border hover:cursor-pointer hover:bg-panel2  hover:scale-[1.02] transition-all duration-150 ease-in-out ${width <= 500 ? "w-full" : ""}`}
                    onClick={() => {
                        triggerHaptic()
                        setOpen(true)
                    }}>
                        Edit 
                </button>
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="max-w-[400px] w-[90%] bg-panel1 rounded-2xl p-6 outline-1 outline-border"
                onClick={e => e.stopPropagation()}>
                    <p className="text-center text-title text-xl font-medium">
                        Edit Goal
                    </p>
                    <div className="flex flex-col  gap-2 mt-5">
                        <div className="flex justify-between items-end">
                            <p className="text-sm text-subtext1">
                                Goal Name
                            </p>
                            <p className="text-[10px] text-subtext3  ">
                                {name.length}/30
                            </p>
                        </div>
                        <input type="text" 
                            className="outline-1 outline-border rounded-md px-1.5 text-subtext2 text-xs h-6"
                            placeholder="Enter goal name..."
                            value={name}
                            onChange={e => Util.setValueLim( setName, e.target.value, 30)}/>
                    </div>

                    <div className="flex flex-col  gap-2 mt-5">
                        <p className="text-sm text-subtext1">
                            Associated Habits
                        </p>
                        <div className="flex flex-col gap-2 max-h-50 overflow-y-scroll no-scrollbar">
                            {habits.map((h, i) => {
                                return(
                                    <div className="border-1 rounded-md border-border2 p-1 flex items-center justify-between">
                                        <p className="text-sm text-subtext3">
                                            {h.icon} {h.name}
                                        </p>
                                        <p onClick={async () => {
                                            triggerHaptic()
                                            loadingIndex.current = 1 + i
                                            if(HC.currentGaol === null) return
                                            await HC.removeAssociatedHabit(HC.currentGaol, h.id)
                                        }}>
                                            {HC.loading && loadingIndex.current == 1 + i?
                                            <AiOutlineLoading className="animate-spin text-subtext3"/> :
                                            <TiDelete className="text-subtext3 hover:cursor-pointer"/>}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="mt-4">
                        <DeleteArchiveGoal/>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-btn w-full mt-4 h-7 flex justify-center items-center rounded-md p-1 text-btn-text hover:cursor-pointer text-sm font-medium"
                        onClick={async () => {
                            triggerHaptic()
                            loadingIndex.current = 0
                            await updateName(name, HC.currentGaol!)
                            setOpen(false)
                        }}>
                            {HC.loading && loadingIndex.current == 0 ? <AiOutlineLoading className="animate-spin"/> : "Save"}
                        </button>
                         <button className="bg-btn w-full mt-4 rounded-md p-1 text-btn-text hover:cursor-pointer text-sm font-medium"
                        onClick={() => {
                            triggerHaptic()
                            setOpen(false)
                        }}>
                            Exit
                        </button>
                    </div>
                </div>
            </Model>
        </>

    )
}
