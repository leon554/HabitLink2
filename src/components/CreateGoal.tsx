import { useContext, useEffect, useRef, useState } from "react"
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
import { triggerHaptic } from "tactus";
import TextBoxLimited from "./primatives/TextBoxLimited";
import ButtonComp from "./primatives/ButtonComp";
import { useNavigate } from "react-router-dom";


export default function CreateGoal() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(-1)
    const [startValue, setStartValue] = useState("")
    const [goalValue, setGoalValue] = useState("")
    const [date, setDate] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [showNewHabitModal, setShowNewHabitModal] = useState(false)
    const [selectHabits, setSelectedHabits] = useState<number[]>([])
    const habitTypes = ["Normal", "Time Based", "Distance Based", "Iteration Based"]
    const [linkedID, setLinkedId] = useState(-1)
    const [habits, setHabits] = useState<string[]>([])
    const [habitName, setHabitName] = useState("")
    const [countData, setCountData] = useState(true)
    const loadingRef = useRef(-1)

    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)
    const naviagte = useNavigate()


    useEffect(() => {
        setCountData(true)
    }, [linkedID])
    async function submit(){
        const type = (linkedID == -1) ? habitTypes[selectedTypeIndex] : HC.habits.get(linkedID)?.type
        if(linkedID != -1) selectHabits.push(linkedID) //no proper fix
        
        if(name == "") {alert("Goal needs a name"); return}
        if(selectHabits.length == 0) {alert("Assocaite or link atleast one habit. If you have no habits create a habit first"); return}
        if(!type) {alert("Choose a goal type before creating a goal"); return}

        let goalVal = Number(goalValue)
        let startVal = Number(startValue)

        if(type == HabitTypeE.Normal && linkedID == -1) {
            startVal = 0
            goalVal = 1
        }
        if(linkedID != -1) {
            startVal = 0
            if(goalValue == "" || goalVal <= 0) {alert("Goal value must be filled in with a number bigger than 0"); return}
        }
        if(type != HabitTypeE.Normal && linkedID == -1) {
           if(goalValue == "" || startValue == "") {alert("Start and goal values must be filled in with a number"); return}
           if(goalVal == startVal) {alert("Goal and start values can't be the same "); return}
        }
        if(linkedID == -1) setCountData(true)
        if(goalVal < 0 || startVal < 0) {alert("Start or goal value cant be negative values"); return}
        
        if(isNaN(goalVal) || isNaN(startVal)) {alert("Start and goal values must be a number"); return}
        if(!dateUtils.isStringValidDate(date, new Date())) {alert("Date is not valid it needs to be in the correct format and in the future"); return}

        await HC.createGoal(name, description, type, startVal, goalVal, selectHabits, dateUtils.stringToDate(date), linkedID == -1 ? null : linkedID, countData)
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
        if(name == "") {
            alert("Please enter a goal name first")
            return
        }
        setHabits([])
        const habitArr = await HC.askGpt('Given the goal of ' + name + ', identify the essential actions needed to achieve this goal and translate them into specific, measurable, and trackable habits that can be logged daily or weekly in a habit tracking app. Ensure that each habit is actionable, clear, and easy to monitor. Habits must begin with a verb and be concise. Habits must not include the word "daily" or "weekly". ONLY list the habits, separated by commas and nothing else. Some great examples of habits are "Stretch", "morning walk", "take creatinine", "drink protein shake", "measure weight", "code", "go gym" and "run". Habits should be no more than 4 words')
        if(!habitArr){return}
        setHabits(habitArr.split(","))
    }
    async function genDescription(){
        if(name == "") {
            alert("Enter goal name first in order to generate description")
            return
        }
        setDescription("Loading...")
        const description = await HC.askGpt('write a 1 sentence description for the following goal: ' + name)
        if(!description){
            setDescription("")
            return
        }
        setDescription(description)
    }

    return (
        <>
            <div className="shadow-md shadow-gray-200 dark:shadow-none rounded-2xl bg-panel1 outline-1 outline-border flex p-4 text-title    max-md:max-w-[500px] max-w-[900px] w-[90%] flex-col items-center relative">
                <p className="text-2xl mt-4 mb-7 font-semibold md:mb-10">
                    Create Goal 🎯
                </p>
                <div className="flex max-md:flex-col  w-full">
                    <div className="w-full flex flex-col items-center ">
                        
                        <div className="w-[90%] max-w-[450px]    mb-5 ">
                            <TextBoxLimited
                                name="Goal Name"
                                value={name}
                                setValue={setName}
                                charLimit={30}
                                placeHolder="Enter Goal Name"/>
                        </div>
                        <div className="w-[90%] max-w-[450px] relative mb-5">
                            <TextBoxLimited
                                name="Goal Description"
                                value={description}
                                setValue={setDescription}
                                charLimit={200}
                                placeHolder="Enter Goal Name"
                                textArea={true}
                                custom={
                                    <p className="absolute right-2 bottom-2 hover:cursor-pointer text-subtext2 bg-panel1"
                                    onClick={async () => {
                                        triggerHaptic()
                                        loadingRef.current = 1
                                        await genDescription()
                                    }}>
                                        {HC.loading && loadingRef.current == 1 ? <AiOutlineLoading className="animate-spin" size={12}/> : <RiAiGenerate size={14}/>}
                                    </p>
                                }/>
                        </div>

                        <div className="w-[90%] max-w-[450px]    mb-6">
                            <p className="text-sm font-medium  text-subtext-1 mb-2">Associated Habits</p>
                            <ButtonComp
                                name={selectHabits.length == 0 && linkedID == -1? "Select Habits" : `${selectHabits.length + ((linkedID != -1) ? 1 : 0)} ${selectHabits.length + ((linkedID != -1) ? 1 : 0) == 1 ? "habit" : "habits"} associated${(linkedID != -1) ? ", 1 Linked" : ""}`}
                                onSubmit={() => {
                                    setShowModal(true)
                                }}
                                highlight={false}
                                small={true}
                                style="w-full"/>
                        </div>
                    
                    </div>

                    <div className="w-full flex flex-col items-center">
                        {linkedID == -1?
                        <div className="w-full flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-2 w-[90%] max-w-[450px]">
                                <p className="text-sm font-medium  text-subtext-1">Goal Type </p> 
                                <IoInformationCircleOutline size={14} color="#f5f5f4" className="hover:cursor-pointer" onClick={() => {
                                    triggerHaptic()
                                    alert("Normal: e.g. Get promotion at work, Time based: e.g Run a 3 hour marathon, Distance based: Run 5km in 20 minutes, Iteration based can be anything: e.g Weight 80kg  where you set the start value to your current weight and the goal value to your goal weight. Note with selecting one of these numeric type everytime you log your goal that value you logged will become your current value, if you want cumulative progress link a habit which will in turn track your progress such as: Goal: 'gym 30 times' and habit: 'gym' ")
                                }}/>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-stretch mb-6 w-[90%] max-w-[450px]">
                                {habitTypes.map((h, i) => {
                                return(
                                    <>
                                        <ButtonComp
                                            name={h}
                                            highlight={selectedTypeIndex == i}
                                            onSubmit={() => setSelectedTypeIndex(i)}
                                            small={true}
                                            style="flex-grow"/>
                                    </>
                                )
                            })}
                            </div>
                            {habitTypes[selectedTypeIndex] != "Normal" &&  habitTypes[selectedTypeIndex] != undefined ? 
                            <div className="w-[90%] max-w-[450px] mb-6">
                                <TextBoxLimited
                                    name="Start Value"
                                    value={startValue}
                                    setValue={setStartValue}
                                    placeHolder={"Enter start " + getPlaceHolderText()}
                                    charLimit={10}
                                    numeric={true}/>
                            </div> : ""}

                            {habitTypes[selectedTypeIndex] != "Normal" &&  habitTypes[selectedTypeIndex] != undefined? <div className="w-[90%] max-w-[450px] mb-6">
                                <TextBoxLimited
                                    name="Goal Value"
                                    value={goalValue}
                                    setValue={setGoalValue}
                                    placeHolder={"Enter start " + getPlaceHolderText()}
                                    charLimit={10}
                                    numeric={true}/>
                            </div> : ""}
                        </div>: 
                        <div className="w-full flex flex-col items-center mb-6">
                            <div className="w-[90%] max-w-[450px] mb-2">
                                <TextBoxLimited
                                    name="Goal Value"
                                    value={goalValue}
                                    setValue={setGoalValue}
                                    placeHolder={"Enter goal " + (countData ? getLinkedPlaceHolderText() : "completions")}
                                    charLimit={10}
                                    numeric={true}
                                    infoText={HC.habits.get(linkedID)!.type != HabitTypeE.Normal ?
                                        "Enter the goal value for your goal. This will track progress either by counting habit completions or by using the actual data you log, depending on your selection. For example, if Count Data is selected for a linked habit like 'Go for 5 km run', your goal progress will be measured in kilometers, so logging a 5 km run adds 5 km. If Count Completions is selected, progress will be measured in completions, so completing the habit counts as one completion regardless of distance."
                                        : "This is the goal value for your goal so the value you want to reach"
                                    }/>
                            </div>
                            {HC.habits.get(linkedID)!.type != HabitTypeE.Normal ? 
                            <div className="flex w-[90%] gap-3">
                                <ButtonComp
                                    name={"Count Data"}
                                    small={true}
                                    highlight={countData}
                                    onSubmit={() => {setCountData(true)}}
                                    style="w-full"/>
                                <ButtonComp
                                    name={"Count Completions"}
                                    small={true}
                                    highlight={!countData}
                                    onSubmit={() => {setCountData(false)}}
                                    style="w-full truncate px-5"/>
                            </div>
                            : null}
                        </div>}

                        <div className="w-[90%] max-w-[450px]    mb-8">
                            <p className="text-sm font-medium  text-subtext-1 mb-2">Complete Goal On</p>
                            <div className="flex gap-3 items-center flex-wrap justify-stretch">
                                <DateInput minDate={new Date()} date={date} setDate={setDate}/>
                                <p className="text-sm text-subtext3">
                                    Add
                                </p>
                                <ButtonComp
                                    name="Day"
                                    highlight={false}
                                    small={true}
                                    onSubmit={() => {
                                        triggerHaptic()
                                        addX({days: 1})
                                    }}
                                    style="flex-grow"/>
                                <ButtonComp
                                    name="Week"
                                    highlight={false}
                                    small={true}
                                    onSubmit={() => {
                                        triggerHaptic()
                                        addX({weeks: 1})
                                    }}
                                    style="flex-grow"/>
                                <ButtonComp
                                    name="Month"
                                    highlight={false}
                                    small={true}
                                    onSubmit={() => {
                                        triggerHaptic()
                                        addX({months: 1})
                                    }}
                                    style="flex-grow"/>
                            </div>
                        </div>

                        <ButtonComp
                            name={HC.loading && loadingRef.current == 2 ? <AiOutlineLoading className="animate-spin" /> : "Create Goal"}
                            onSubmit={async () => {
                                loadingRef.current = 2
                                await submit()
                            }}
                            highlight={true}
                            style="w-[90%] mb-6"/>
                    </div>
                </div>
            </div>
            <Model open={showModal} onClose={() => setShowModal(false)}>
                <div className="p-3 flex flex-col  items-center max-w-[600px] w-[90%] bg-panel1 rounded-2xl  "
                 onClick={e => e.stopPropagation()}>
                    <div className="w-full flex flex-col items-center">
                        <div className="flex justify-between items-center mb-2 mt-3 w-[90%]">
                            <p className=" font-medium select-none text-title w-[90%]">
                                Select Habits
                            </p>
                            <IoInformationCircleOutline className="mt-1 text-subtext3 text-sm hover:cursor-pointer" onClick={() =>{
                                triggerHaptic()
                                setShowInfo(true)
                            }}/>
                        </div>
                        {HC.habits.size == 0 ?
                            <div className="w-[90%]">
                                <p className="text-sm text-subtext3">
                                    You don’t have any habits yet. Create one first before adding a goal, just click the “New Habit” button below 💪
                                </p>
                            </div> : null
                        }
                        <div className="flex flex-col p-[2px] gap-2 mb-3 items-stretch w-[91%] max-h-[262px] overflow-y-scroll no-scrollbar rounded-lg">
                            {Array.from(HC.habits.values()).map((h, i) => {
                                return(
                                    <div className={`shadow-sm shadow-gray-200 dark:shadow-none bg-panel1 rounded-md w-full hover:cursor-pointer select-none flex justify-between outline-1 outline-border2 h-10`} key={i} 
                                        onClick={() => {
                                            triggerHaptic()
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
                                            <div className={`h-[100%]  w-3 ${selectHabits.includes(Number(h.id)) ? "bg-green-500" : Number(h.id) == linkedID ? "bg-blue-400" : " dark:bg-progress-panel"}  rounded-l-md`}>
                                            </div>
                                            <p className="p-2 text-subtext1 text-sm font-medium">
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
                    </div>
                    {habits.length >= 1 ? 
                    <div className="w-[90%] mt-3">
                        <p className="text-title font-medium">
                            Possible Habits
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3 w-full justify-stretch mb-7 max-h-27.5 overflow-y-scroll no-scrollbar p-1">
                            {habits.map(h => {
                                return(
                                    <div className="shadow-sm shadow-gray-200 dark:shadow-none outline-1 rounded-md outline-border flex-grow-1 p-1.5 flex justify-center px-2 hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out"
                                        onClick={() => {
                                            triggerHaptic()
                                            setHabitName(Util.capitilizeFirst(h) ?? "")
                                            setShowNewHabitModal(true)
                                        }}>
                                        <p className="text-xs text-subtext2 font-medium">
                                            {Util.capitilizeFirst(h)}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    :""}
                    <div className="flex items-center w-[90%] gap-2">
                        <button className="shadow-sm shadow-gray-200 dark:shadow-none rounded-md outline-1 font-medium outline-border2 flex justify-center items-center text-subtext1 text-sm h-8 hover:cursor-pointer w-full hover:bg-panel2 transition-colors duration-150 ease-in-out" 
                            onClick={async () => {
                                triggerHaptic()
                                loadingRef.current = 3
                                await genHabits()
                            }}>
                            {HC.loading && loadingRef.current == 3 ? <AiOutlineLoading className="animate-spin" /> : "Generate Habits"}
                        </button>
                        <button className="shadow-sm shadow-gray-200 dark:shadow-none rounded-md outline-1 outline-border2 text-sm font-medium text-subtext1  h-8 hover:cursor-pointer w-full hover:bg-panel2 transition-colors duration-150 ease-in-out" 
                            onClick={() => {
                                triggerHaptic()
                                setShowNewHabitModal(true)
                            }}>
                            New Habit
                        </button>
                    </div>
                    <button className="shadow-md shadow-gray-200 dark:shadow-none bg-btn w-[90%] rounded-md outline-1 text-sm font-medium outline-border1 text-btn-text mb-5 mt-2 h-8 hover:cursor-pointer" 
                        onClick={() => {
                            triggerHaptic()
                            setShowModal(false)
                        }}>
                        Done
                    </button>
                </div>
            </Model>
            <Model open={showNewHabitModal} onClose={() => setShowNewHabitModal(false)}>
                <div className="w-[90%]  max-w-[900px]  max-md:max-w-[500px] max-h-[80dvh] rounded-2xl overflow-scroll no-scrollbar" 
                 onClick={e => e.stopPropagation()}>
                    <Create compact={true} onCreate={() => setShowNewHabitModal(false)} initialName={habitName}/>
                </div>
            </Model>
            <Model open={showInfo} onClose={() => setShowInfo(false)}>
                <div className="w-[90%] max-w-[500px] bg-panel1 outline-1 outline-border  rounded-2xl p-7 " 
                 onClick={e => e.stopPropagation()}>
                    <p className="text-title text-xl mb-6 font-medium">
                        Info
                    </p>
                    <div className="mt-4 flex flex-col gap-5">
                        <div className="flex flex-col gap-5 max-h-[50dvh] overflow-y-scroll no-scrollbar">
                            <p className="text-sm text-subtext2">
                                You have two ways to add habits to goals
                            </p>
                            <p className="text-sm text-subtext2 border-l-8 border-green-500 pl-3 rounded-md">
                                <strong>Associate a habit</strong> This associates the habit to a goal so that the goal’s stats such as consistency and strength are automatically calculated from this habit.  
                                You will see a green square next to the habit on the previous page to indicate it is associated. Note: you can associate multiple habits.
                            </p>

                            <p className="text-sm text-subtext2 border-l-8 border-blue-500 pl-3 rounded-md">
                                <strong>Link a habit</strong> This uses the habit to track progress toward a specific goal.  
                                For example, if your habit is <em>"Go to the gym"</em> and your goal is <em>"Gym 30 times this month"</em> linking the habit will automatically update your goal progress every time you log the habit.  
                                A blue square next to the habit on the previous page indicates it is linked. You can link a habit by double clicking it. Note: a linked habit will automatically also be associated
                            </p>
                        </div>
                        <div className="flex w-full gap-3 mt-4 mb-2">
                            <ButtonComp
                                name="Done"
                                highlight={true}
                                onSubmit={() => setShowInfo(false)}
                                noAnimation={true}
                                style="w-full"
                            />
                            <ButtonComp
                                name="Learn More"
                                highlight={false}
                                onSubmit={() => naviagte("/help")}
                                noAnimation={true}
                                style="w-full"
                            />
                        </div>
                    </div>
                </div>
            </Model>
        </>
    )
}
