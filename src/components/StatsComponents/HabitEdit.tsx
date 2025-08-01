import { useContext, useEffect, useRef, useState } from "react"
import Model from "../InputComponents/Model"
import { UserContext } from "../Providers/UserProvider"
import { AiOutlineLoading } from "react-icons/ai"
import { dateUtils } from "@/utils/dateUtils"
import { Util } from "@/utils/util"
import { HabitTypeE } from "@/utils/types"
import { TiDelete } from "react-icons/ti";
import { AlertContext } from "../Alert/AlertProvider"
import DateInput from "../InputComponents/DateInput"
import AmountInput from "../InputComponents/NumberInput"
import DistanceInput from "../InputComponents/DistanceInput"
import TimeInput from "../InputComponents/TimeInput"

export default function HabitEdit() {

    const [open, setOpen] = useState(false)
    const [openNewComp, setOpenNewComp] = useState(false)
    const [date, setDate] = useState("")
    const [entryData, setEntryData] = useState(0)

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
    async function newEntry(){
        if(!dateUtils.isStringValidDate(date, new Date(Number(HC.currentHabit!.creationDate)), new Date())){
            alert("Date entered is not valid it needs to be between today and the habits creation date which is " + dateUtils.formatDate(new Date(Number(HC.currentHabit!.creationDate))))
            setDate("")
            return
        }

        const dateObj = dateUtils.stringToDate(date)

        if(HC.currentHabit?.type == HabitTypeE.Normal){
            const completions = HC.habitsCompletions.get(HC.currentHabit.id) ?? []

            const hasSameDay = completions.some(c =>
                dateUtils.isDatesSameDay(dateObj, new Date(Number(c.date)))
            );

            if (hasSameDay) {
                alert("Can't create entry on a day which already has an entry for normal habits");
                return;
            }
        }

        await HC.compleHabit(HC.currentHabit!.id, HC.currentHabit?.type == HabitTypeE.Normal ? 1 : entryData, dateObj)
        alert("Succefully added entry!")
    }

    useEffect(() => {
        if(!open){
            btnClicked.current = -1
        }
    }, [open])
    useEffect(() => {
        HC.setCurrentHabit(HC.habits.get(HC.currentHabit!.id)!)
    }, [HC.habits])

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
                    <div className="w-full max-w-[450px]  flex flex-col items-start gap-2 mb-2">
                        <p className="text-[16px] flex-grow-2 text-subtext1 whitespace-nowrap">Habit Name</p>
                        <input type="text" 
                        placeholder={`${prevName}`}
                        value={habitName}
                        onChange={e => setHabitName(e.target.value)}
                        className="outline-1 px-2 text-xs rounded-xl h-7 w-full  outline-border2  p-1 text-subtext1 " />
                    </div>
                    <div className="w-full max-w-[450px]  flex flex-col items-start gap-2 mb-3">
                        {Array.from(HC.habitsCompletions.get(HC.currentHabit!.id) ?? []).length == 0 ? "" :
                            <>
                            <p className="text-[16px] flex-grow-2 text-subtext1 whitespace-nowrap">Habit Completions</p>
                            <div className="flex flex-col max-h-[200px] overflow-y-scroll w-full no-scrollbar gap-1.5 rounded-xl">
                                {Array.from(HC.habitsCompletions.get(HC.currentHabit!.id) ?? []).map((c,i) => {
                                    return(
                                        <div className=" rounded-xl border-border2 border-1 p-1 px-2 flex justify-between items-center h-7" key={i}>
                                            <p className="text-xs" >
                                                {dateUtils.formatDate(new Date(Number(c.date)))} | Data: {Util.pretifyData(c.data, HC.currentHabit!.type as HabitTypeE)}
                                            </p>
                                            <p className="hover:cursor-pointer" onClick={async () => {
                                                btnClicked.current = 10 + i
                                                await deleteEntry(c.id)
                                            }}>
                                                {HC.loading && btnClicked.current == 10 + i ? <AiOutlineLoading className="animate-spin"/>  : <TiDelete />} 
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                            </>
                        }
                        <button className="rounded-xl outline-1 outline-border2 w-full text-sm p-1 hover:cursor-pointer"
                            onClick={() => {
                                setEntryData(0)
                                setOpenNewComp(true)
                            }}>
                            New Entry
                        </button>
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
            <Model open={openNewComp} onClose={() => setOpenNewComp(false)}>
                <div className="bg-panel1 p-5 px-9 rounded-xl max-w-[450px] gap-4  w-[80%] flex flex-col items-center  text-subtext3 outline-1 outline-border"
                    onClick={e => e.stopPropagation()}>
                    <p className="text-title text-xl mt-2 mb-2 font-medium">
                        New Entry
                    </p>
                    <div className="w-full flex flex-col gap-2">
                        <p className="text-[16px]  text-subtext1 whitespace-nowrap">Entry Date </p>
                        <DateInput date={date} setDate={setDate} maxDate={new Date()} minDate={new Date(Number(HC.currentHabit!.creationDate))} fullWidth={true}/>
                    </div> 
                    {HC.currentHabit?.type === HabitTypeE.Normal ? "" : 
                    <div className="w-full">
                        <div className="w-full flex flex-col gap-2">
                            <p className="text-[16px]  text-subtext1 whitespace-nowrap">Data</p>
                            {HC.currentHabit!.type == HabitTypeE.Time_Based ? 
                                <TimeInput setDuration={setEntryData}/> 
                                : 
                                HC.currentHabit!.type == HabitTypeE.Distance_Based ? 
                                <DistanceInput distance={entryData} setDistance={setEntryData} />
                                :
                                <AmountInput amount={entryData} setAmount={setEntryData}/> 
                            }
                        </div> 
                    </div>}
                    <div className="w-full flex  gap-4 mt-2 mb-3">
                        <button className="rounded-xl text-sm flex-grow-1 bg-btn text-btn-text h-8 p-1 px-5 hover:cursor-pointer flex justify-center items-center"
                            onClick={async () => {
                                btnClicked.current = 3
                                await newEntry()
                            }}>
                            {HC.loading && btnClicked.current == 3 ? <AiOutlineLoading className="animate-spin"/>  : "Save"}
                        </button>
                        <button className="rounded-xl text-sm font-normal flex-grow-2 bg-btn text-btn-text h-8 p-1 px-5 hover:cursor-pointer"
                            onClick={() => {
                                setOpenNewComp(false)
                            }}>
                            Exit
                        </button>
                    </div>
                </div>
            </Model>
        </>

    )
}
