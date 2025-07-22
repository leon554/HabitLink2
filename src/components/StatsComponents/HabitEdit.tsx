import { useContext, useEffect, useRef, useState } from "react"
import Model from "../InputComponents/Model"
import { UserContext } from "../Providers/UserProvider"
import { AiOutlineLoading } from "react-icons/ai"
import { dateUtils } from "@/utils/dateUtils"
import { Util } from "@/utils/util"
import type { HabitTypeE } from "@/utils/types"
import { TiDelete } from "react-icons/ti";
import { AlertContext } from "../Alert/AlertProvider"

export default function HabitEdit() {

    const [open, setOpen] = useState(false)

    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)

    const [habitName, setHabitName] = useState("")
    const prevName = HC.currentHabit?.name ?? "N/A"
    const btnClicked = useRef(-1)

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
    async function deleteEntry(id: number) {
        await HC.deleteHabitCompletion(id, HC.currentHabit!.id)
        alert("Succefully removed completions!")
    }

    useEffect(() => {
        if(!open){
            btnClicked.current = -1
        }
    }, [open])
    useEffect(() => {
        HC.setCurrentHabit(HC.habits.get(HC.currentHabit!.id)!)
    }, [HC.habits])
    //add where a user can make a entry not todays
    return (
        <>
            <button className="bg-panel1 p-2 px-9 rounded-xl text-subtext3 outline-1  outline-border hover:cursor-pointer hover:bg-panel2  hover:scale-[1.02] transition-all duration-150 ease-in-out"
                onClick={() => setOpen(true)}>
                    Edit 
            </button>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="bg-panel1 p-5 px-9 rounded-xl max-w-[450px] gap-4  w-[80%] flex flex-col items-center  text-subtext3 outline-1 outline-border"
                    onClick={e => e.stopPropagation()}>
                    <p className="text-title text-xl mt-2 mb-2 font-medium">
                        Edit Habit
                    </p>
                    <div className="w-full max-w-[450px]  flex flex-col items-start gap-3 mb-2">
                        <p className="text-[16px] flex-grow-2 text-subtext1 whitespace-nowrap">Habit Name</p>
                        <input type="text" 
                        placeholder={`${prevName}`}
                        value={habitName}
                        onChange={e => setHabitName(e.target.value)}
                        className="outline-1 flex-grow-2 px-2 text-[12px] rounded-xl w-full border-0  outline-border2 text-sm p-1.5 text-subtext1 " />
                    </div>
                    <div className="w-full max-w-[450px]  flex flex-col items-start gap-3 mb-3">
                        <p className="text-[16px] flex-grow-2 text-subtext1 whitespace-nowrap">Habit Completions</p>
                        <div className="flex flex-col max-h-[200px] overflow-y-scroll w-full no-scrollbar gap-1.5 rounded-xl">
                            {Array.from(HC.habitsCompletions.get(HC.currentHabit!.id)!).map((c,i) => {
                                return(
                                    <div className=" rounded-xl border-border2 border-1 p-1 px-2 flex justify-between items-center" key={i}>
                                        <p className="text-xs" >
                                            {dateUtils.formatDate(new Date(Number(c.date)))} | Data: {Util.pretifyData(c.data, HC.currentHabit!.type as HabitTypeE)}
                                        </p>
                                        <p className="hover:cursor-pointer" onClick={async () => {
                                            btnClicked.current = 3 + i
                                            deleteEntry(c.id)
                                        }}>
                                            {HC.loading && btnClicked.current == 3 + i ? <AiOutlineLoading className="animate-spin"/>  : <TiDelete />} 
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>        
                    <div className="flex justify-stretch w-full gap-4 mb-5">
                        <button className="rounded-xl text-sm flex-grow-1 bg-btn text-btn-text h-8 p-1 px-5 hover:cursor-pointer"
                            onClick={async () => {
                                btnClicked.current = 1
                                await save()
                            }}>
                            {HC.loading && btnClicked.current == 1 ? <AiOutlineLoading className="animate-spin"/>  : "Save"}
                        </button>
                        <button className="rounded-xl text-sm font-normal flex-grow-2 bg-btn text-btn-text h-8 p-1 px-5 hover:cursor-pointer"
                            onClick={() => {
                                setOpen(false)
                            }}>
                            Exit
                        </button>
                        <button className="rounded-xl text-sm flex justify-center items-center  px-5 outline-1 h-8 hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out w-full outline-red-500 text-red-500"
                            onClick={async () => {
                                if(btnClicked.current == 2){
                                    await deleteHabit()
                                }else{
                                    alert("Are you sure you want to delete this habit? To delete habit click `delete` button again")
                                }
                                btnClicked.current = 2
                            }}>
                            {HC.loading && btnClicked.current == 2 ? <AiOutlineLoading className="animate-spin"/>  : "Delete Habit"} 
                        </button>
                    </div>
                </div>
            </Model>
        </>

    )
}
