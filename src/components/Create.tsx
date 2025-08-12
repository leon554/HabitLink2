import {useContext, useRef, useState, useEffect} from "react";
import NumericInput from "./InputComponents/NumericInput";
import { IoInformationCircleOutline } from "react-icons/io5";
import { AlertContext } from "./Alert/AlertProvider";
import { UserContext } from "./Providers/UserProvider";
import { AiOutlineLoading } from "react-icons/ai";
import TimeInput from "./InputComponents/TimeInput";
import DistanceInput from "./InputComponents/DistanceInput";
import NumberInput from "./InputComponents/NumberInput";
import { RiAiGenerate } from "react-icons/ri";
import { Util } from "@/utils/util";
import { triggerHaptic } from "tactus";



interface Props{
    compact: boolean
    onCreate?: () => void
    initialName? : string
}
export default function Create({compact, onCreate, initialName} : Props){
    const [compsPerWeek, setCompsPerWeek] = useState(0)
    const [compDays, setCompDays] = useState({mon: false, teu: false, wed: false, thu: false, fri: false, sat: false, sun: false})
    const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1)
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(-1)
    const [name, setName] = useState(initialName ?? "")
    const [time, setTime] = useState(0)
    const [distance, setDistance] = useState(0)
    const [amount, setAmount] = useState(0)
    const [description, setDescription] = useState("")
    const habitEmojis = ["💪","📖","🧘","📝","🥗","🚰","😴","📚","🏃","🧹","🛏️","🪥","💻","🎨","🎵","☀️","📅","💸","📵","🧼","🧊","🏋️","🧠","🎯","👣","🍎","🚭","🍵","🌿","🕯️","👨‍🍳","🚿","🪑","🐶","🤝"];
    const habitTypes = ["Normal", "Time Based", "Distance Based", "Iteration Based"]
    const emojiDiv = useRef<HTMLDivElement>(null)
    const loadingRef = useRef(-1)

    const {alert} = useContext(AlertContext)
    const HC = useContext(UserContext)

    useEffect(() => {
        if (initialName !== undefined) {
            setName(initialName);
        }
    }, [initialName]);

    async function createHabit(){
        
        const completionDaysString = (compsPerWeek == 0) ? getCompDaysString() : `${compsPerWeek}`
        const target = getTarget()

        if(name.trim() == "") {alert("Habit needs a name"); return}
        if(completionDaysString == "" || completionDaysString == "0000000") {alert("Select days to complete the habit on"); return}
        if(selectedTypeIndex == -1) {alert("Select a habit type before creating a habit"); return}
        if(target == 0 && habitTypes[selectedTypeIndex] != "Normal") {alert("Habit daily goal can't be 0"); return}
        if(selectedEmojiIndex == -1) {alert("Select a habit emoji to continue"); return}


        await HC.createHabit(name, description, completionDaysString, habitEmojis[selectedEmojiIndex], habitTypes[selectedTypeIndex], target)
        resetValues()
    }
    function resetValues(){
        setCompsPerWeek(0);
        setCompDays({ mon: false, teu: false, wed: false, thu: false, fri: false, sat: false, sun: false});
        setSelectedEmojiIndex(-1);
        setSelectedTypeIndex(-1);
        setName("");
        setTime(0);
        setDistance(0);
        setAmount(0);
        setDescription("");
    }
    function getCompDaysString(){
        let data = ""
        Object.values(compDays).forEach(v => {
            data += (v) ? "1" : "0"
        })
        return data
    }
    function getTarget(){
        let target = 0
        if(habitTypes[selectedTypeIndex] == "Time Based"){
            target = time
        }else if(habitTypes[selectedTypeIndex] == "Distance Based"){
            target = distance
        }else if(habitTypes[selectedTypeIndex] == "Iteration Based"){
            target = amount
        }
        return target
    }
     async function genDescription(){
        if(name == "") {
            alert("Enter habit name first in order to generate description")
            return
        }
        setDescription("Loading...")
        const habitArr = await HC.askGpt('write a 1 sentence description for the following habit: ' + name)
        if(!habitArr){
            setDescription("")
            return
        }
        setDescription(habitArr)
    }
    return (
        <div className="bg-panel1 outline-1 outline-border  max-w-[900px]  max-md:max-w-[500px] relative flex justify-center rounded-2xl flex-col items-center pb-4   p-4">
            <p className="  text-title font-semibold text-2xl mt-6 mb-8">
                Create New Habit
            </p>
            
            <div className={`flex w-full md:gap-10 md:pl-10 md:pr-10 max-md:flex-col max-md:items-center items-start `}>
                <div className="w-full flex justify-center flex-col items-center ">
                    <div className="w-[90%] max-w-[450px] mb-5">
                        <p className="text-sm font-medium  text-subtext1 mb-2">Habit Name</p>
                        <input type="text" 
                        placeholder="Enter habit name"
                        value={name}
                        onChange={e => Util.setValueLim(setName, e.target.value, 30)}
                        className="outline-1 text-[12px] rounded-md w-full border-0  outline-border2 text-sm p-1.5 text-subtext1 mb-1" />
                        <div className="w-full flex justify-end mt-1 mb-[-13px]">
                            <p className="text-xs text-subtext3">
                                {name.length}/30
                            </p>
                        </div>
                    </div>
                    <div className="w-[90%] max-w-[450px] relative mb-5">
                        <p className="text-sm font-medium text-subtext1 mb-2">Habit Description</p>
                        <textarea
                        placeholder="Enter habit description"
                        value={description}
                        onChange={e => Util.setValueLim(setDescription, e.target.value, 200)}
                        className={`outline-1 text-[12px] ${compact ? "h-7.5" : "h-20"} rounded-md resize-none w-full border-0  outline-border2 text-sm p-1.5 text-subtext1`} />
                        <p className="absolute right-2 bottom-5 hover:cursor-pointer text-subtext2 bg-panel1"
                        onClick={async () => {
                            triggerHaptic()
                            loadingRef.current = 1
                            await genDescription()
                        }}>
                            {HC.loading && loadingRef.current == 1 ? <AiOutlineLoading className="animate-spin" size={12}/> : <RiAiGenerate size={14}/>}
                        </p>
                        <div className="w-full flex justify-end mt-1 mb-[-16px]">
                            <p className="text-xs text-subtext3">
                                {description.length}/200
                            </p>
                        </div>
                    </div>
                    <div className="w-[90%] max-w-[450px]    flex justify-center flex-col items-stretch ">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-sm font-medium text-subtext1">Completion Days </p> 
                                <IoInformationCircleOutline size={14}  className="hover:cursor-pointer text-subtext1" onClick={() => {
                                    triggerHaptic()
                                    alert("You can either choose specific days of the week to complete your habit, or set a target number of completions per week, regardless of which days they fall on.")
                                }}/>
                            </div>
                            <div className=" flex justify-stretch gap-2">
                                {Object.entries(compDays).map((e, i) => {
                                    return(
                                        <button className={`${e[1] ? "bg-highlight outline-1 outline-border dark:outline-0" : "" }  ${e[1] ? "text-stone-900" : "text-subtext1" } ${e[1] ? "outline-0" : "outline-1" } grow-1 pl-2 pr-2 rounded-md outline-border2  hover:cursor-pointer   ease-in-out duration-75`}
                                            onClick={() => {triggerHaptic(); setCompDays(prev => ({...prev, [e[0]]: !e[1]})); setCompsPerWeek(0)}}
                                            key={i}>
                                            {e[0][0].toUpperCase()}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="flex items-center  gap-3 mt-2 mb-5 ">
                            <p className="text-subtext1 text-sm  ">Or</p>
                            <div onClick={() => {
                                triggerHaptic()
                                setCompDays({mon: false, teu: false, wed: false, thu: false, fri: false, sat: false, sun: false})
                            }}>
                                <NumericInput value={compsPerWeek} setValue={setCompsPerWeek} increment={1} min={0} max={7}/>
                            </div>
                            <p className="text-subtext1 text-sm self-center mt-2 mb-3  ">days per week</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2 w-[90%] max-w-[450px]">
                        <p className="text-sm font-medium  text-subtext1">Habit Type </p> 
                        <IoInformationCircleOutline size={14}  className="hover:cursor-pointer text-subtext1" onClick={() => {
                            triggerHaptic()
                            alert("Normal: e.g. go to the gym its yes no \n Time Based: e.g Plank can log 13s \n Distance Based: e.g Walking you walked 12km \n Itteration Based: E.g drink 3 cups of water a day")
                        }}/>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-stretch mb-6 w-[90%] max-w-[450px]">
                        {habitTypes.map((h, i) => {
                        return(
                            <button className={`${selectedTypeIndex == i ? "outline-0 bg-btn text-btn-text" : "text-subtext2 outline-1"} rounded-md px-2 text-sm outline-border2 p-1 grow-1 hover:cursor-pointer hover:bg-btn hover:outline-0   hover:text-btn-text`}
                                onClick={() => {
                                    triggerHaptic()
                                    setSelectedTypeIndex(i)
                                }} key={i}>
                                {compact ?  h.split(" ")[0]: h}
                            </button>
                        )
                    })}
                    </div>
                    {habitTypes[selectedTypeIndex] != "Normal" &&  habitTypes[selectedTypeIndex] != undefined? 
                    <div className="w-[90%] mb-6  max-w-[450px]">
                        <p className="text-sm font-medium  text-subtext1 mb-2">Daily Goal</p>
                        
                        {habitTypes[selectedTypeIndex] == "Time Based" ? 
                            <TimeInput setDuration={setTime}/> 
                        : habitTypes[selectedTypeIndex] == "Distance Based" ? 
                            <DistanceInput setDistance={setDistance} distance={distance} />
                        : 
                            <NumberInput setAmount={setAmount} amount={amount} />
                        }
                    </div> : ""}
                </div>

                <div className="w-[90%] max-w-[450px]    mb-7  ">
                    <p className="text-sm font-medium  text-subtext1 mb-2">Habit Emoji</p>
                        <div className="flex mb-6 gap-2 items-center">
                            {compact ? 
                            <button className="text-btn-text bg-btn px-2 rounded-lg h-7 hover:cursor-pointer md:invisible md:absolute"
                                onClick={() => {
                                    triggerHaptic()
                                    emojiDiv.current?.scrollBy({
                                        left: -300,
                                        behavior: "smooth"
                                    })
                                }}>
                                {"<"}
                            </button> : ""}
                            <div className={`${compact ? "flex overflow-x-scroll gap-2 p-1 no-scrollbar rounded-md" : "flex flex-wrap"}  md:flex-wrap gap-2 justify-stretch`} ref={emojiDiv}>
                                {habitEmojis.map((h, i) => {
                                    return(
                                        <button className={`${selectedEmojiIndex == i ? "outline-0 bg-btn" : "outline-1"} rounded-md outline-border2 p-1 grow-1 hover:cursor-pointer hover:bg-btn hover:outline-0`}
                                            onClick={() => {
                                                triggerHaptic()
                                                setSelectedEmojiIndex(i)
                                            }} key={i}>
                                            {h}
                                        </button>
                                    )
                                })}
                            </div>
                            {compact ? 
                            <button className="text-btn-text bg-btn px-2 h-7 rounded-lg hover:cursor-pointer md:invisible md:absolute"
                                onClick={() => {
                                    triggerHaptic()
                                    emojiDiv.current?.scrollBy({
                                        left: 300,
                                        behavior: "smooth"
                                    })
                                }}>
                                {">"}
                            </button> : ""}
                        </div>
                    
                    <button className=" w-full rounded-md p-1 outline-1 outline-border2 dark:outline-0 bg-btn  text-sm font-medium  hover:cursor-pointer mt-7 flex justify-center h-8 items-center"
                        onClick={async () => {
                            triggerHaptic()
                            loadingRef.current = 2
                            await createHabit(); 
                            if(!onCreate) return
                            onCreate()
                        }}>
                        {HC.loading && loadingRef.current == 2 ? <AiOutlineLoading className="animate-spin" /> : "Create Habit"}
                    </button>
                </div>
            </div>
        </div>
    )
}
