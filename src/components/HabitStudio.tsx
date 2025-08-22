import { Util } from "@/utils/util"
import { useContext, useRef, useState } from "react"
import { IoInformationCircleOutline } from "react-icons/io5"
import NumericInput from "./InputComponents/NumericInput"
import { AlertContext } from "./Alert/AlertProvider"
import { UserContext } from "./Providers/UserProvider"
import { AiOutlineLoading } from "react-icons/ai"
import { HabitTypeE } from "@/utils/types"
import { HabitUtil } from "@/utils/HabitUtil"
import Model from "./InputComponents/Model"
import { triggerHaptic } from "tactus"
import TextBoxLimited from "./primatives/TextBoxLimited"
import ButtonComp from "./primatives/ButtonComp"


export interface habitAI{
    habit: string
    emoji: string
    completion_days: string
    habit_type: HabitTypeE
    target: number
}
interface CompDaysStateType{
    mon: boolean;
    teu: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
}
export default function HabitStudio() {
    const [name, setName] = useState("")
    const [weeklyGoalComps, setWeeklyGoalComps] = useState(0)
    const [weeklyGoalCompsDay, setWeeklyGoalCompsDay] = useState<CompDaysStateType>({mon: false, teu: false, wed: false, thu: false, fri: false, sat: false, sun: false})
    const [habits, setHabits] = useState<habitAI[]>([])
    const loadingRef = useRef(0)

    const selectedHabitIndexRef = useRef(-1)
    const [weeklyHabitComps, setWeeklyHabitComps] = useState(0)
    const [weeklyHabitCompsDay, setWeeklyHabitCompsDay] = useState<CompDaysStateType>({mon: false, teu: false, wed: false, thu: false, fri: false, sat: false, sun: false})
    const [open, setOpen] = useState(false)
    const habitTypes = ["Normal", "Time Based", "Distance Based", "Iteration Based"]
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(-1)
    const [tempHabit, setTempHabit] = useState<habitAI|null>(null)


    const {alert} = useContext(AlertContext)
    const HC = useContext(UserContext)

    async function genHabit(){
        const completionDaysString = (weeklyGoalComps == 0) ? getCompDaysString(weeklyGoalCompsDay) : `${weeklyGoalComps}`

        if(name == "") {
            alert("Please enter a goal name first")
            return
        }
        if(HC.loading){
            alert("Wait for program to finish loading before trying again")
            return
        }
        if(completionDaysString == "0" || completionDaysString == "0000000"){
            alert("Choose avaliable days before continuing")
            return
        }

        setHabits([])
        const habitPrompt = `{"goal":"${name}","available_days":"${completionDaysString}","instructions":"Identify the essential actions needed to achieve the given goal and translate them into specific, measurable, and trackable habits that can be logged only on some or all of the available days. Each habit must be actionable, clear, easy to monitor, begin with a verb, and be concise. Do not include the words 'daily' or 'weekly'. Habits should be no more than 30 characters. ONLY return the habits in JSON format, with no extra explanation. The completion_days must follow these rules: (1) If the input days are a 7-character binary string, return a 7-character binary string (Sunday to Saturday) indicating specific days; (2) If the available days are a single number, return either a binary string or a single number representing total days per week. Any binary string must only include all or some days marked as available in the available_days input however habits can have only some of the avaliable days specified it just cant use days that are not specified.","output_format":[{"habit":"string (max 4 words, starts with a verb)","emoji":"string (appropriate emoji representing the habit)","completion_days":"string (either a number 'X' for days per week, or a binary string '0110010' for specific days, week starting Sunday)","habit_type":"string (one of: Normal (e.g go to gym), Iteration Based (e.g drink 3 glasses of water), Distance Based (e.g walk 200km), Time Based (e.g meditate for 10 minutes))","target":"number (required if habit_type is Iteration Based, Distance Based, or Time Based; distance in km, time in seconds)"}],"examples":[{"habit":"Stretch","emoji":"🧘","completion_days":"3","habit_type":"Normal"},{"habit":"Morning walk","emoji":"🚶‍♂️","completion_days":"1010100","habit_type":"Distance Based","target":5},{"habit":"Measure weight","emoji":"⚖️","completion_days":"2","habit_type":"Iteration Based","target":8},{"habit":"Meditate","emoji":"🧘‍♂️","completion_days":"1110000","habit_type":"Time Based","target":600}]}`;
        const habitArr = await HC.askGpt(habitPrompt)
        if(!habitArr){return}
        setHabits(JSON.parse(habitArr))
    }
    async function createHabit(habitIndex: number){
        const habit = habits[habitIndex]
        const completionDaysString = habit.completion_days
        const target = habit.target

        if(habit.habit.trim() == "") {alert("Habit needs a name"); return}
        if(completionDaysString == "" || completionDaysString == "0000000") {alert("Select days to complete the habit on"); return}
        if(!habit.habit_type) {alert("Select a habit type before creating a habit"); return}
        if(target == 0 && habitTypes[selectedTypeIndex] != "Normal") {alert("Habit daily goal can't be 0"); return}

        await HC.createHabit(habit.habit, "", completionDaysString, habit.emoji, habit.habit_type, target)
        alert("Habit Succefully Created!")
        habits.splice(habitIndex, 1)
    }
    function getCompDaysString(compDaysSate: CompDaysStateType){
        let data = ""
        Object.values(compDaysSate).forEach(v => {
            data += (v) ? "1" : "0"
        })
        return data
    }
    function setHabitDaysToState(compDays: string, setFuncDay: (compdays: CompDaysStateType) => void, setFunc: (compdays: number) => void){
        if(compDays.length == 1){
            setFunc(Number(compDays))
        }else{
            const mondayStart = Util.sunBinrayStringToMon(compDays).split("")
            const mapKeys = ["mon", "teu", "wed", "thu", "fri", "sat", "sun"]
            mapKeys.forEach((k, i) => {
                weeklyHabitCompsDay[k as keyof typeof weeklyHabitCompsDay] = mondayStart[i] == "1"
            })
            setFuncDay(weeklyHabitCompsDay)
        }
    }

    return (
        <div className="w-full flex justify-center flex-col items-center gap-3 mb-10">
            <div className="mt-18 relative w-[90%] max-w-[500px] flex flex-col items-center bg-panel1 p-7 rounded-2xl outline-1 outline-border gap-5">
                <p className="text-xl font-medium text-title">
                    Habit Studio
                </p>
                <IoInformationCircleOutline size={14}  className="hover:cursor-pointer text-subtext1 absolute right-3 top-3" onClick={() => {
                    alert("Habit Studio lets you set a goal, choose the days you can work on it, and generates habits to help you achieve it.")
                }}/>
                <div className="w-full mb-1">
                    <TextBoxLimited
                        name="Goal Name"
                        value={name}
                        setValue={setName}
                        charLimit={30}
                        placeHolder="Enter goal name..."/>
                </div>
                <div className="w-full flex justify-center flex-col items-stretch ">
                    <div>
                        <div className="flex items-center gap-2 mb-2.5">
                            <p className="text-sm font-medium text-subtext1">Avaliable Days</p> 
                            <IoInformationCircleOutline size={14}  className="hover:cursor-pointer text-subtext1" onClick={() => {
                                triggerHaptic()
                                alert("You can either choose specific days of the week that your avaliable, or set a target number of days per week, regardless of which days they fall on.")
                            }}/>
                        </div>
                        <div className=" flex justify-stretch gap-2">
                            {Object.entries(weeklyGoalCompsDay).map((e, _) => {
                                return(
                                    <>
                                        <ButtonComp
                                            name={e[0][0].toUpperCase()}
                                            onSubmit={() => {
                                                setWeeklyGoalCompsDay(prev => ({...prev, [e[0]]: !e[1]}))
                                                setWeeklyGoalComps(0)
                                            }}
                                            xs={true}
                                            highlight={e[1]}
                                            style="flex-grow"/>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex items-center  gap-3 mt-2 mb-5 ">
                        <p className="text-subtext1 text-sm  ">Or</p>
                        <div onClick={() => {
                            triggerHaptic()
                            setWeeklyGoalCompsDay({mon: false, teu: false, wed: false, thu: false, fri: false, sat: false, sun: false})
                        }}>
                            <NumericInput value={weeklyGoalComps} setValue={setWeeklyGoalComps} increment={1} min={0} max={7}/>
                        </div>
                        <p className="text-subtext1 text-sm self-center mt-2 mb-3">days per week</p>
                    </div>
                    <ButtonComp
                        name={HC.loading && loadingRef.current == 1 ? <AiOutlineLoading className="animate-spin" /> : "Generate Habits"}
                        onSubmit={async () =>  {
                            loadingRef.current = 1
                            await genHabit()
                        }}
                        highlight={false}/>
                </div>
                {habits.length == 0 ? "" :
                    <div className="w-full flex flex-col items-center gap-3">
                        <p className="text-sm font-medium  text-subtext1 mt-2 w-full">Genrated Habits</p>  
                        {habits.map((h, i) => {
                            return(
                                <div key={i} className="shadow-sm shadow-gray-200 dark:shadow-none outline-1 bg-panel1 w-full items-center p-3 rounded-md outline-border flex  justify-between gap-1">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-title text-sm  font-medium">
                                            {h.emoji} {h.habit}
                                        </p>
                                        <div className="flex gap-2 ml-1 max-sm:flex-col max-sm:gap-0.5">
                                            <p className="text-xs text-subtext2">
                                                {HabitUtil.getCompletionDaysString(Util.sunBinrayStringToMon(h.completion_days))}
                                            </p>
                                            <p className="text-xs text-subtext2">
                                                Type: {Util.capitilizeFirst(h.habit_type)}
                                            </p>
                                            {h.habit_type == HabitTypeE.Normal ? "" :
                                            <p className="text-xs text-subtext2">
                                                Target: {Util.pretifyData(h.target, h.habit_type)}
                                            </p>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center max-sm:flex-col">
                                        <button className="shadow-sm shadow-gray-200 dark:shadow-none outline-1 outline-border2 w-12 text-xs font-medium px-2 text-subtext2 rounded-md h-8 max-sm:h-7 flex  items-center justify-center hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out"
                                            onClick={async () => {
                                                triggerHaptic()
                                                loadingRef.current = i + 2
                                                await createHabit(i)
                                            }}>
                                            {HC.loading && loadingRef.current == i + 2? <AiOutlineLoading className="animate-spin"/> : "Create"}
                                        </button>
                                        <button className="shadow-sm shadow-gray-200 dark:shadow-none outline-1 outline-border2 text-xs font-medium px-2 text-subtext2 rounded-md h-8 max-sm:h-7 w-full flex  items-center justify-center hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out"
                                            onClick={() => {
                                                triggerHaptic()
                                                setTempHabit({...h})
                                                setHabitDaysToState(h.completion_days, setWeeklyHabitCompsDay, setWeeklyHabitComps)
                                                const habitTypeIndex = habitTypes.findIndex(t => t == h.habit_type)
                                                setSelectedTypeIndex(habitTypeIndex)
                                                selectedHabitIndexRef.current = i
                                                setOpen(true)
                                            }}>
                                            Edit 
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div onClick={e => e.stopPropagation()}
                    className="bg-panel1 outline-1 outline-border rounded-2xl p-7 w-[90%] max-w-[500px] flex flex-col items-center gap-6"> 
                    <p className="text-lg font-medium text-title">
                        Edit Habit
                    </p>

                    <div className="w-[90%] max-w-[450px]">
                        <TextBoxLimited
                            name="Habit Name"
                            value={tempHabit?.habit}
                            setValue={(value) => setTempHabit({...tempHabit, habit: value} as habitAI)}
                            placeHolder="Enter habit name"
                            charLimit={30}/>
                    </div>


                    <div className="w-[90%] max-w-[450px]  flex justify-center flex-col items-stretch gap-1.5 ">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-sm font-medium text-subtext1">Completion Days</p> 
                                <IoInformationCircleOutline size={14}  className="hover:cursor-pointer text-subtext1" onClick={() => {
                                    triggerHaptic()
                                    alert("You can either choose specific days of the week to complete your habit, or set a target number of completions per week, regardless of which days they fall on.")
                                }}/>
                            </div>
                            <div className=" flex justify-stretch gap-2">
                                {Object.entries(weeklyHabitCompsDay).map((e, i) => {
                                    return(
                                        <button className={`shadow-sm shadow-gray-200 dark:shadow-none ${e[1] ? "bg-highlight outline-1 outline-border dark:outline-0" : "" }  ${e[1] ? "text-stone-900" : "text-subtext1" } ${e[1] ? "outline-0" : "outline-1" } grow-1 pl-2 pr-2 rounded-md outline-border2  hover:cursor-pointer  text-sm`}
                                            onClick={() => {
                                                triggerHaptic()
                                                setWeeklyHabitCompsDay(prev => ({...prev, [e[0]]: !e[1]})); setWeeklyHabitComps(0)
                                            }}
                                            key={i}>
                                            {e[0][0].toUpperCase()}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="flex items-center  gap-3 mt-2">
                            <p className="text-subtext1 text-sm  ">Or</p>
                            <div onClick={() => {
                                triggerHaptic()
                                setWeeklyHabitCompsDay({mon: false, teu: false, wed: false, thu: false, fri: false, sat: false, sun: false})
                            }}>
                                <NumericInput value={weeklyHabitComps} setValue={setWeeklyHabitComps} increment={1} min={0} max={7}/>
                            </div>
                            <p className="text-subtext1 text-sm self-center">days per week</p>
                        </div>
                    </div>



                    <div className="w-[90%] max-w-[450px] flex justify-center flex-col items-stretch ">
                        <div className="flex items-center gap-2 mb-2 w-full">
                            <p className="text-sm font-medium  text-subtext1">Habit Type </p> 
                            <IoInformationCircleOutline size={14}  className="hover:cursor-pointer text-subtext1" onClick={() => {
                                alert("Normal: e.g. go to the gym its yes no \n Time Based: e.g Plank can log 13s \n Distance Based: e.g Walking you walked 12km \n Itteration Based: E.g drink 3 cups of water a day")
                            }}/>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-stretch w-full">
                            {habitTypes.map((h, i) => {
                            return(
                                <button className={`shadow-sm shadow-gray-200 dark:shadow-none ${selectedTypeIndex == i ? "outline-0 bg-btn text-btn-text" : "text-subtext2 outline-1"} rounded-md px-2 text-sm outline-border2 p-1 grow-1 hover:cursor-pointer hover:bg-btn hover:outline-0   hover:text-btn-text`}
                                    onClick={() => {
                                        triggerHaptic()
                                        setSelectedTypeIndex(i)
                                        setTempHabit({...tempHabit, target: 0, habit_type: habitTypes[i]} as habitAI)
                                    }} key={i}>
                                    {h}
                                </button>
                            )
                        })}
                        </div>
                    </div>


                    {habitTypes[selectedTypeIndex] == HabitTypeE.Normal ? "" :
                    <div className="w-[90%] max-w-[450px] flex justify-center flex-col items-stretch ">
                        <div className="flex items-center gap-2 mb-2 w-full">
                            <p className="text-sm font-medium  text-subtext1">Habit Target</p> 
                            <IoInformationCircleOutline size={14}  className="hover:cursor-pointer text-subtext1" onClick={() => {
                                triggerHaptic()
                                alert("Normal: e.g. go to the gym its yes no \n Time Based: e.g Plank can log 13s \n Distance Based: e.g Walking you walked 12km \n Itteration Based: E.g drink 3 cups of water a day")
                            }}/>
                        </div>
                        {habitTypes[selectedTypeIndex] == HabitTypeE.Time_Based ? 
                            <div className='flex gap-1.5 items-center '>
                                <input type='number' 
                                value={Math.floor((tempHabit?.target ?? 0) / 3600) || ""}
                                onChange={e => {
                                    let value = Math.abs(Math.round(Number(e.target.value)))
                                    if(value > 24) value = 24
                                    setTempHabit({...tempHabit, target: value*3600 + (tempHabit?.target ?? 0)%3600} as habitAI)
                                }}
                                className='shadow-sm shadow-gray-200 dark:shadow-none outline-1 rounded-md outline-border2 w-full text-sm px-1.5 text-subtext2 appearance-none py-0.5'/>
                                <p className='mr-2 text-subtext2 font-medium text-sm'>
                                    h
                                </p>
                                <input type='number' 
                                value={(tempHabit?.target??0)%3600/60 || ""}
                                onChange={e => {
                                    let value = Math.abs(Math.round(Number(e.target.value)))
                                    if(value > 59) value = 59
                                    setTempHabit({...tempHabit, target: (tempHabit?.target ?? 0) - (tempHabit?.target ?? 0)%3600 + value*60} as habitAI)
                                }}
                                className='shadow-sm shadow-gray-200 dark:shadow-none outline-1 rounded-md outline-border2 w-full text-sm px-1.5 text-subtext2 appearance-none py-0.5'/>
                                <p className='text-subtext2 text-sm font-medium'>
                                    m
                                </p>
                            </div> :
                            <input type='number' 
                            value={tempHabit?.target || ""}
                            onChange={e => {
                                setTempHabit({...tempHabit, target: Number(e.target.value)} as habitAI)
                            }}
                            className='outline-1 rounded-md outline-border2 h-6 w-full text-sm px-1.5 text-subtext2 appearance-none'/>
                        }
                    </div>
                    }
                    <button className="shadow-md shadow-gray-200 dark:shadow-none bg-btn max-w-[450px] text-sm font-medium text-btn-text rounded-md h-8 mb-3 flex w-[90%] items-center justify-center hover:cursor-pointer"
                        onClick={() => {
                            triggerHaptic()
                            const completionDaysString = (weeklyHabitComps == 0) ? Util.monBinrayStringToSun(getCompDaysString(weeklyHabitCompsDay)) : `${weeklyHabitComps}`
                            habits[selectedHabitIndexRef.current] = {...tempHabit, completion_days: completionDaysString} as habitAI
                            setHabits([...habits])
                            setOpen(false)
                        }}>
                        Save Habit
                    </button>
                </div>
            </Model>
        </div>
    )
}
