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
import TextBoxLimited from "../primatives/TextBoxLimited"
import ButtonComp from "../primatives/ButtonComp"


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
                <button className={`shadow-md shadow-gray-200 dark:shadow-none bg-panel1 p-2 px-9 rounded-xl text-subtext3 outline-1  outline-border hover:cursor-pointer hover:bg-panel2  hover:scale-[1.02] transition-all duration-150 ease-in-out ${width <= 500 ? "w-full" : ""}`}
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
                    <TextBoxLimited 
                        name={"Goal Name"} 
                        value={name} 
                        setValue={setName} 
                        charLimit={30} 
                        placeHolder={"Enter Habit Name..."}
                        outerDivStyles="mt-6"/>

                    <div className="flex flex-col  gap-2 mt-5">
                        <p className="text-sm text-subtext1 font-medium">
                            Associated Habits
                        </p>
                        <div className="flex flex-col gap-2 max-h-50 overflow-y-scroll no-scrollbar">
                            {habits.map((h, i) => {
                                return(
                                    <div className="shadow-sm shadow-gray-200 dark:shadow-none border-1 rounded-md border-border2 p-1 flex items-center justify-between">
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
                    <div className="mt-6">
                        <DeleteArchiveGoal noAnimate={true}/>
                    </div>
                    <div className="flex gap-3 mt-3">
                        <ButtonComp
                            name={HC.loading && loadingIndex.current == 0 ? <AiOutlineLoading className="animate-spin"/> : "Save"}
                            onSubmit={async () => {
                                loadingIndex.current = 0
                                await updateName(name, HC.currentGaol!)
                                setOpen(false)
                            }}
                            highlight={true}
                            short={true}
                            style="w-full"
                            noAnimation={true}/>
                        <ButtonComp
                            name={"Exit"}
                            onSubmit={() => setOpen(false)}
                            highlight={true}
                            short={true}
                            style="w-full"
                            noAnimation={true}/>
                    </div>
                </div>
            </Model>
        </>

    )
}
