import { useContext, useEffect, useState } from "react"
import Model from "../InputComponents/Model"
import { UserContext } from "../Providers/UserProvider"
import { AiOutlineLoading } from "react-icons/ai"


export default function HabitEdit() {

    const [open, setOpen] = useState(false)

    const HC = useContext(UserContext)

    const [habitName, setHabitName] = useState("")
    const [prevName, _] = useState(HC.currentHabit?.name ?? "N/A")

    async function save(){
        if(habitName == ""){
            return setOpen(false)
        }
        await HC.updateHabitName(habitName, HC.currentHabit!.id)
        setHabitName("")
        return setOpen(false)
    }
    async function deleteHabit(){
        await HC.deleteHabit(HC.currentHabit!.id)
        HC.setCurrentHabit(null)
        setOpen(false)
    }
    useEffect(() => {
        HC.setCurrentHabit(HC.habits.get(HC.currentHabit!.id)!)
    }, [HC.habits])

    return (
        <>
            <button className="bg-panel1 p-2 px-9 rounded-xl text-subtext3 outline-1 font-mono outline-border hover:cursor-pointer hover:bg-panel2  hover:scale-[1.02] transition-all duration-150 ease-in-out"
                onClick={() => setOpen(true)}>
                    Edit 
            </button>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="bg-panel1 p-5 px-9 rounded-xl max-w-[450px] gap-4 font-mono w-[80%] flex flex-col items-center  text-subtext3 outline-1 outline-border"
                    onClick={e => e.stopPropagation()}>
                    <p className="text-title text-lg mt-2 mb-2">
                        Edit Habit
                    </p>
                    <div className="w-full max-w-[450px]  font-mono">
                        <p className="text-[16px]  text-subtext1 mb-2">Habit Name</p>
                        <input type="text" 
                        placeholder={`${prevName}`}
                        value={habitName}
                        onChange={e => setHabitName(e.target.value)}
                        className="outline-1 px-2 text-[12px] rounded-xl w-full border-0  outline-border2 text-sm p-1.5 text-subtext1 mb-1" />
                    </div>
                    <div className="flex justify-stretch w-full gap-4 mb-4">
                        <button className="rounded-xl text-sm flex-grow-1 bg-btn text-btn-text h-8 p-1 px-5 hover:cursor-pointer"
                            onClick={save}>
                            {HC.loading ? <AiOutlineLoading className="animate-spin"/>  : "Save"}
                        </button>
                        <button className="rounded-xl text-sm flex-grow-2 bg-btn text-btn-text h-8 p-1 px-5 hover:cursor-pointer">
                            {HC.loading ? <AiOutlineLoading className="animate-spin"/>  : "Exit"}
                        </button>
                        <button className="rounded-xl text-sm flex justify-center items-center  px-5 outline-1 h-8 outline-border2 dark:text-subtext2 text-subtext1 hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out w-full"
                            onClick={deleteHabit}>
                            {HC.loading ? <AiOutlineLoading className="animate-spin"/>  : "Delete Habit"} 
                        </button>
                    </div>
                </div>
            </Model>
        </>

    )
}
