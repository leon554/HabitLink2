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
import { triggerHaptic } from "tactus"
import TextBoxLimited from "../primatives/TextBoxLimited"
import ButtonComp from "../primatives/ButtonComp"

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
        const habitID = HC.currentHabit!.id
        const isLinkedToGoal = Util.fetchAllMapItems(HC.goals).some(g => ((g.linkedHabit ?? -1) == habitID))
        const goalsAssociated = Util.fetchAllMapItems(HC.goals).filter(g => g.habits.split(",").includes(String(habitID)))
        const isNotDeletable = goalsAssociated.some(g => g.habits.split(",").length == 1)

        if(isLinkedToGoal || isNotDeletable){
            alert("Habit is associated or linked with a goal delete that goal first before deleting this habit")
            return
        }

        for(const goal of goalsAssociated){
            await HC.removeAssociatedHabit(goal.id, habitID)
        }
        await HC.deleteHabit(habitID)
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

        await HC.compleHabit(HC.currentHabit!.id, HC.currentHabit?.type == HabitTypeE.Normal ? 1 : entryData, false ,dateObj)
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
            <button className="shadow-md shadow-gray-200 dark:shadow-none bg-panel1 p-2 px-9 rounded-xl text-subtext3 outline-1  outline-border hover:cursor-pointer hover:bg-panel2  hover:scale-[1.02] transition-all duration-150 ease-in-out"
                onClick={() => {
                    triggerHaptic()
                    setOpen(true)
                }}>
                    Edit 
            </button>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="bg-panel1 p-5 px-9 rounded-2xl max-w-[500px] gap-4  w-[90%] flex flex-col items-center  text-subtext3 outline-1 outline-border"
                    onClick={e => e.stopPropagation()}>
                    <p className="text-title text-xl mt-2 mb-2 font-medium">
                        Edit Habit
                    </p>
                    <div className="w-full max-w-[450px]  flex flex-col items-start gap-2 mb-2"> 
                        <TextBoxLimited
                            name="Habit Name"
                            value={habitName}
                            setValue={setHabitName}
                            placeHolder={prevName}
                            charLimit={30}
                            outerDivStyles="w-full"/>
                    </div>
                    <div className="w-full max-w-[450px]  flex flex-col items-start gap-2 mb-3">
                        {Array.from(HC.habitsCompletions.get(HC.currentHabit!.id) ?? []).length == 0 ? "" :
                            <>
                            <p className=" flex-grow-2 text-sm font-medium text-subtext1 whitespace-nowrap">Habit Completions</p>
                            <div className="flex flex-col max-h-[200px] overflow-y-scroll w-full no-scrollbar gap-1.5 rounded-md">
                                {Array.from(HC.habitsCompletions.get(HC.currentHabit!.id) ?? []).sort((a, b) => a.date - b.data).map((c,i) => {
                                    return(
                                        <div className="shadow-sm shadow-gray-200 dark:shadow-none rounded-md border-border2 border-1 p-1 px-2 flex justify-between items-center h-7" key={i}>
                                            <p className="text-xs" >
                                                {dateUtils.formatDate(new Date(Number(c.date)))} | Data: {Util.pretifyData(c.data, HC.currentHabit!.type as HabitTypeE)}
                                            </p>
                                            <p className="hover:cursor-pointer" onClick={async () => {
                                                triggerHaptic()
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
                        <ButtonComp
                            name="New Entry"
                            small={true}
                            highlight={false}
                            style="w-full mt-2 mb-[-10px] "
                            noAnimation={true}
                            onSubmit={() => {
                                setEntryData(0)
                                setOpenNewComp(true)
                            }}/>
                    </div>        
                    <div className="flex justify-stretch w-full gap-4 mb-5">
                        <ButtonComp
                            name={HC.loading && btnClicked.current == 1 ? <AiOutlineLoading className="animate-spin"/>  : "Save"}
                            onSubmit={async () => {
                                btnClicked.current = 1
                                await save()
                            }}
                            highlight={true}
                            style="w-[30%]"
                            noAnimation={true}/>
                        <ButtonComp
                            name={ "Exit"}
                            onSubmit={() => setOpen(false)}
                            highlight={true}
                            style="w-[30%]"
                            noAnimation={true}/>
                        <button className="rounded-md w-full text-sm truncate overflow-hidden whitespace-nowrap flex justify-center items-center  px-5 border-1 h-8 hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out border-red-500 text-red-500"
                            onClick={async () => {
                                triggerHaptic()
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
                <div className="bg-panel1 p-5 px-9 rounded-2xl max-w-[500px] gap-4  w-[90%] flex flex-col items-center  text-subtext3 outline-1 outline-border"
                    onClick={e => e.stopPropagation()}>
                    <p className="text-title text-xl mt-2 mb-2 font-medium">
                        New Entry
                    </p>
                    <div className="w-full flex flex-col gap-2">
                        <p className="text-sm font-medium text-subtext1 whitespace-nowrap">Entry Date </p>
                        <DateInput date={date} setDate={setDate} maxDate={new Date()} minDate={new Date(Number(HC.currentHabit!.creationDate))} fullWidth={true}/>
                    </div> 
                    {HC.currentHabit?.type === HabitTypeE.Normal ? "" : 
                    <div className="w-full">
                        <div className="w-full flex flex-col gap-2">
                            <p className="text-sm font-medium text-subtext1 whitespace-nowrap">Data</p>
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
                        <ButtonComp
                            name={HC.loading && btnClicked.current == 3 ? <AiOutlineLoading className="animate-spin"/>  : "Save"}
                            onSubmit={async () => {
                                btnClicked.current = 3
                                await newEntry()
                            }}
                            highlight={true}
                            style="w-full"
                            noAnimation={true}/>
                         <ButtonComp
                            name={"Exit"}
                            onSubmit={() => setOpenNewComp(false)}
                            highlight={true}
                            style="w-full"
                            noAnimation={true}/>
                    </div>
                </div>
            </Model>
        </>

    )
}
