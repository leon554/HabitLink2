import { useContext, useState } from "react"
import { IoInformationCircleOutline } from "react-icons/io5";
import { AlertContext } from "./Alert/AlertProvider";
import { UserContext } from "./Providers/UserProvider";
import Model from "./InputComponents/Model";
import { AiOutlineLoading } from "react-icons/ai";
import { add } from "date-fns";
import { FaLink } from "react-icons/fa";
import { HabitTypeE } from "../utils/types";
import { dateUtils } from "../utils/dateUtils";
import Create from "./Create";
import DateInput from "./InputComponents/DateInput";
import { Util } from "@/utils/util";
import { RiAiGenerate } from "react-icons/ri";


export default function CreateGoal() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(-1)
    const [startValue, setStartValue] = useState("")
    const [goalValue, setGoalValue] = useState("")
    const [date, setDate] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showNewHabitModal, setShowNewHabitModal] = useState(false)
    const [selectHabits, setSelectedHabits] = useState<number[]>([])
    const habitTypes = ["Normal", "Time Based", "Distance Based", "Iteration Based"]
    const [linkedID, setLinkedId] = useState(-1)
    const [habits, setHabits] = useState<string[]>([])
    const [habitName, setHabitName] = useState("")

    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)

    async function submit(){
        const type = (linkedID == -1) ? habitTypes[selectedTypeIndex] : HC.habits.get(linkedID)?.type
        let goalVal = Number(goalValue)
        let startVal = Number(startValue)

        if(isNaN(goalVal) || isNaN(startVal)) {alert("Start and goal values must be a number"); return}
        if(!type) {alert("Error linked habit type is undefined"); return}
        if(!dateUtils.isStringValidDate(date, new Date())) {alert("Date is not valid it needs to be in the correct format and in the future"); return}
        

        if(type == HabitTypeE.Normal && linkedID == -1) {
            goalVal = 1
            startVal = 0
        }
        if(linkedID != -1) selectHabits.push(linkedID)
        await HC.createGoal(name, description, type, startVal, goalVal, selectHabits, dateUtils.stringToDate(date), linkedID == -1 ? null : linkedID)
        setName(""); setDescription(""); setSelectedTypeIndex(-1); setStartValue(""); setGoalValue(""); setSelectedHabits([]); setDate("")
    }
    function getPlaceHolderText(){
        if(habitTypes[selectedTypeIndex] == "Distance Based"){
            return "distance(km)"
        }else if(habitTypes[selectedTypeIndex] == "Time Based"){
            return "duration(hours)"
        }else{
            return "amount"
        }
    }
    function getDateToString(d: Date){
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth()+1).padStart(2, "0")}/${d.getFullYear()}`
    }
    function addX(parameters: object){
        if(date == ""){
            setDate(getDateToString(add(new Date(), parameters)))
        }else if(dateUtils.isStringValidDate(date, new Date())){
            const date1 = dateUtils.stringToDate(date)
            const date2 = add(date1, parameters)
            setDate(getDateToString(date2))
        }else{
            alert("Current date is not valid, amount has been added to todays date.")
            setDate(getDateToString(add(new Date(), parameters)))
        }
    }
    function getLinkedPlaceHolderText(){
        if(linkedID == -1) return ""
        const type = HC.habits.get(linkedID)?.type
        if(!type) alert("Linked habit doesnt exist")
        if(type == "Distance Based"){
            return "distance(km)"
        }else if(type == "Time Based"){
            return "duration(hours)"
        }else if(type == "Iteration Based"){
            return "iteration count"
        }else{
            return "completion amount"
        }
    }
    async function genHabits(){
        setHabits([])
        const habitArr = await HC.askGpt('Given the goal of ' + name + ', identify the essential actions needed to achieve this goal and translate them into specific, measurable, and trackable habits that can be logged daily or weekly in a habit tracking app. Ensure that each habit is actionable, clear, and easy to monitor. Habits must begin with a verb and be concise. Habits must not include the word "daily" or "weekly". ONLY list the habits, separated by commas and nothing else. Some great examples of habits are "Stretch", "morning walk", "take creatinine", "drink protein shake", "measure weight", "code", "go gym" and "run". Habits should be no more than 4 words')
        setHabits(habitArr.split(","))
    }
    async function genDescription(){
        if(name == "") {
            alert("Enter goal name first in order to generate description")
            return
        }
        setDescription("Loading...")
        const habitArr = await HC.askGpt('write a 1 sentence description for the following goal: ' + name)
        setDescription(habitArr)
    }

    return (
        <>
            <div className="rounded-2xl bg-panel1 outline-1 outline-border flex p-4 text-title    max-md:max-w-[500px] max-w-[900px] w-[90%] flex-col items-center relative">
                <p className="text-2xl mt-4 mb-7 font-semibold md:mb-10">
                    Create Goal 🎯
                </p>
                <div className="flex max-md:flex-col  w-full">
                    <div className="w-full flex flex-col items-center ">
                        
                        <div className="w-[90%] max-w-[450px]    mb-5 ">
                            <p className="text-[16px]  text-subtext-1 mb-2">Goal Name</p>
                            <input type="text" 
                            placeholder="Enter goal name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="outline-1 text-[12px] rounded-xl w-full border-0  outline-border2 text-sm p-1.5 text-subtext1 mb-1" />
                        </div>
                        <div className="w-[90%] max-w-[450px] relative mb-5">
                            <p className="text-[16px]  text-subtext-1 mb-2">Goal Description</p>
                            <textarea
                            placeholder="Enter goal description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="outline-1 text-[12px] h-20 rounded-xl resize-none w-full border-0 no-scrollbar outline-border2 text-sm p-1.5 text-subtext1" />
                            <p className="absolute right-2 bottom-3 hover:cursor-pointer text-subtext2 bg-panel1"
                            onClick={async () => {
                                await genDescription()
                            }}>
                                {HC.loading ? <AiOutlineLoading className="animate-spin" size={12}/> : <RiAiGenerate size={14}/>}
                            </p>
                        </div>

                        <div className="w-[90%] max-w-[450px]    mb-6">
                            <p className="text-[16px]  text-subtext-1 mb-2">Associated Habits</p>
                            <button className={`outline-1 rounded-xl outline-border2 w-full p-1 grow-1 hover:cursor-pointer hover:bg-btn hover:outline-0 text-subtext1 text-sm hover:text-btn-text`}
                                    onClick={() => setShowModal(true)}>
                                    {selectHabits.length == 0 && linkedID == -1? "Select Habits" : `${selectHabits.length + ((linkedID != -1) ? 1 : 0)} ${selectHabits.length + ((linkedID != -1) ? 1 : 0) == 1 ? "habit" : "habits"} associated${(linkedID != -1) ? ", 1 Linked" : ""}`}
                            </button>
                        </div>
                    
                    </div>

                    <div className="w-full flex flex-col items-center">
                        {linkedID == -1?
                        <div className="w-full flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-2 w-[90%] max-w-[450px]">
                                <p className="text-[16px]  text-subtext-1">Goal Type </p> 
                                <IoInformationCircleOutline size={14} color="#f5f5f4" className="hover:cursor-pointer" onClick={() => {
                                    alert("Normal: e.g. go to the gym its yes no \n Time Based: e.g Plank can log 13s \n Distance Based: e.g Walking you walked 12km \n Itteration Based: E.g drink 3 cups of water a day")
                                }}/>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-stretch mb-6 w-[90%] max-w-[450px]">
                                {habitTypes.map((h, i) => {
                                return(
                                    <button className={`${selectedTypeIndex == i ? "outline-0 bg-btn text-btn-text" : "outline-1 text-subtext1"} rounded-xl outline-border2 p-1 grow-1 hover:cursor-pointer hover:bg-btn hover:outline-0 text-sm px-2 hover:text-stone-900`}
                                        onClick={() => setSelectedTypeIndex(i)} key={i}>
                                        {h}
                                    </button>
                                )
                            })}
                            </div>
                            {habitTypes[selectedTypeIndex] != "Normal" &&  habitTypes[selectedTypeIndex] != undefined? <div className="w-[90%] max-w-[450px] mb-6">
                                <p className="text-[16px]  text-subtext-1 mb-2">Start Value</p>
                                
                                <input type="text" 
                                        placeholder={"Enter start " + getPlaceHolderText()}
                                        value={startValue}
                                        onChange={e => setStartValue(e.target.value)}
                                        className="outline-1 text-[12px] rounded-xl w-full border-0  outline-border2 text-sm p-1.5 text-subtext1 mb-1" />
                            </div> : ""}

                            {habitTypes[selectedTypeIndex] != "Normal" &&  habitTypes[selectedTypeIndex] != undefined? <div className="w-[90%] max-w-[450px] mb-6">
                                <p className="text-[16px]  text-subtext-1 mb-2">Goal Value</p>
                                <input type="text" 
                                        placeholder={"Enter goal " + getPlaceHolderText()}
                                        value={goalValue}
                                        onChange={e => setGoalValue(e.target.value)}
                                        className="outline-1 text-[12px] rounded-xl w-full border-0  outline-border2 text-sm p-1.5 text-subtext1 mb-1" />
                            </div> : ""}
                        </div>: 
                        <div className="w-full flex flex-col items-center">
                            <div className="w-[90%] max-w-[450px] mb-6">
                                <p className="text-[16px]  text-subtext-1 mb-2">Goal Value</p>
                                <input type="text" 
                                        placeholder={"Enter goal " + getLinkedPlaceHolderText()}
                                        value={goalValue}
                                        onChange={e => setGoalValue(e.target.value)}
                                        className="outline-1 text-[12px] rounded-xl w-full border-0  outline-border2 text-sm p-1.5 text-subtext1 mb-1" />
                            </div>
                        </div>}

                        <div className="w-[90%] max-w-[450px]    mb-8">
                            <p className="text-[16px]  text-subtext-1 mb-2">Complete Goal On</p>
                            <div className="flex gap-3 items-center flex-wrap justify-stretch">
                                <DateInput minDate={new Date()} date={date} setDate={setDate}/>
                                <p className="text-sm text-subtext3">
                                    Add
                                </p>
                                <button className="outline-1 flex-grow-1 h-7 px-3 text-sm rounded-xl flex items-center justify-center outline-border2 text-subtext1 hover:cursor-pointer hover:bg-btn hover:text-btn-text transition-colors duration-150 ease-in-out darkmode:hover:outline-0"
                                    onClick={() => addX({days: 1})}>
                                    Day
                                </button>
                                <button className="outline-1 flex-grow-1 h-7 px-3 text-sm rounded-xl flex items-center justify-center outline-border2 text-subtext1 hover:cursor-pointer hover:bg-btn hover:text-btn-text transition-colors duration-150 ease-in-out darkmode:hover:outline-0"
                                    onClick={() => addX({weeks: 1})}>
                                    Week
                                </button>
                                <button className="outline-1 flex-grow-1 h-7 px-3 text-sm rounded-xl flex items-center justify-center outline-border2 text-subtext1 hover:cursor-pointer hover:bg-btn hover:text-btn-text transition-colors duration-150 ease-in-out darkmode:hover:outline-0"
                                    onClick={() => addX({months: 1})}>
                                    Month
                                </button>
                            </div>
                        </div>


                        <button className="bg-btn text-btn-text outline-1 dark:outline-0 outline-border2 hover:cursor-pointer rounded-xl w-[90%] max-w-[450px] py-1 mb-6 h-9 flex justify-center items-center" 
                            onClick={submit}>
                            {HC.loading ? <AiOutlineLoading className="animate-spin" /> : "Create Goal"}
                        </button>
                    </div>
                </div>
            </div>
            <Model open={showModal} onClose={() => setShowModal(false)}>
                <div className="p-3 flex flex-col  items-center max-w-[600px] w-[90%] bg-panel1 rounded-2xl  "
                 onClick={e => e.stopPropagation()}>
                    <p className="mb-4 mt-2 text-2xl select-none text-title">
                        Select Habits
                    </p>
                    <div className="flex flex-col p-[1px] gap-2 mb-3 items-stretch w-[90%] max-h-[400px] overflow-y-scroll no-scrollbar rounded-lg">
                        {Array.from(HC.habits.values()).map((h, i) => {
                            return(
                                <div className={`bg-panel2 rounded-xl w-full hover:cursor-pointer select-none flex justify-between outline-1 outline-border2 h-10`} key={i} 
                                    onClick={() => {
                                        if(selectHabits.includes(Number(h.id))){
                                            setSelectedHabits(p => [...p.filter(d => d != Number(h.id))])
                                            setLinkedId(Number(h.id))
                                        }else{
                                            if(linkedID == Number(h.id)){
                                                setLinkedId(-1)
                                            }
                                            else{
                                                setSelectedHabits(p => [...p, Number(h.id)])
                                            }
                                        }
                                    }}>
                                    <div className="flex items-center">
                                        <div className={`h-[100%]  w-3 ${selectHabits.includes(Number(h.id)) ? "bg-green-500" : Number(h.id) == linkedID ? "bg-blue-400" : " dark:bg-progress-panel"}  rounded-l-xl`}>
                                        </div>
                                        <p className="p-2 text-subtext1">
                                            {h.icon} {h.name}
                                        </p>  
                                    </div>
                                    <div className="flex items-center mr-2 text-xs">
                                        {Number(h.id) == linkedID ? <FaLink className="text-subtext2"/> : ""} 
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {habits.length >= 1 ? 
                    <div className="w-[90%] mt-3">
                        <p className="text-title text-lg">
                            Possible Habits
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3 w-full justify-stretch mb-7">
                            {habits.map(h => {
                                return(
                                    <div className="outline-1 rounded-xl outline-border flex-grow-1 p-1 flex justify-center px-2 hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out"
                                        onClick={() => {
                                            setHabitName(Util.capitilizeFirst(h) ?? "jfhfd")
                                            setShowNewHabitModal(true)
                                        }}>
                                        <p className="text-sm text-subtext2">
                                            {Util.capitilizeFirst(h)}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    :""}
                    <div className="flex items-center w-[90%] gap-2">
                        <button className=" rounded-xl outline-1 outline-border2 flex justify-center items-center text-subtext1 text-sm h-8 hover:cursor-pointer w-full hover:bg-panel2 transition-colors duration-150 ease-in-out" 
                            onClick={async () => await genHabits()}>
                            {HC.loading ? <AiOutlineLoading className="animate-spin" /> : "Generate Habits"}
                        </button>
                        <button className="  rounded-xl outline-1 outline-border2 text-subtext1 text-sm  h-8 hover:cursor-pointer w-full hover:bg-panel2 transition-colors duration-150 ease-in-out" 
                            onClick={() => setShowNewHabitModal(true)}>
                            New Habit
                        </button>
                    </div>
                    <button className="bg-btn w-[90%] rounded-xl outline-1 outline-border1 text-btn-text mb-5 mt-2 h-8 hover:cursor-pointer" 
                        onClick={() => setShowModal(false)}>
                        Done
                    </button>
                </div>
            </Model>
            <Model open={showNewHabitModal} onClose={() => setShowNewHabitModal(false)}>
                <div className="w-[90%]  max-w-[900px]  max-md:max-w-[500px]" 
                 onClick={e => e.stopPropagation()}>
                    <Create compact={true} onCreate={() => setShowNewHabitModal(false)} initialName={habitName}/>
                </div>
            </Model>
        </>
    )
}
