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
import { triggerHaptic } from "tactus";
import TextBoxLimited from "./primatives/TextBoxLimited";
import ButtonComp from "./primatives/ButtonComp";
import Switch from "./InputComponents/Switch";
import { NO_GOAL_HABIT_TARGET } from "@/utils/Constants";



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
    const [noGoal, setNoGoal] = useState(false)
    const habitEmojis = [
        "💪","📖","🧘","📝","🥗","🚰","😴","📚","🏃","🧹",
        "🛏️","🪥","💻","🎨","🎵","☀️","📅","💸","📵","🧼",
        "🧊","🏋️","🧠","🎯","👣","🍎","🚭","🍵","🌿","🕯️",
        "👨‍🍳","🚿","🪑","🐶","🤝","🚴","🏊","🥊","🏸","⛹️",
        "🧗","🛹","🚶","🧎","🏕️","🌍","🌳","🌱","🌸","🪴",
        "🧑‍🌾","🐟","🍞","🍳","🍊","🥛","🥒","🥕","🌽","🍓",
        "🍌","🥜","🫘","🍚","🍱","🍣","🥟","🍲","🥘","🫖",
        "☕","🥤","🍺","🍷","🍸","🍹","🥂","🧋","🥡","🍫",
        "🍪","🍩","🍿","🥨","🥯","🍯","🥬","🍍","🥥","🥭",
        "🎮","🎧","📺","📷","📸","🎬","🎤","🎹","🎻","🥁",
        "🐕","🚗","🚌","🚆","✈️","🛳️","📦","📮","✉️","📞",
        "📱","💡","🕰️","🛒","🧺","🧴","🧷","🧩","🪙","💳"
    ];
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
        let target = getTarget()

        if(name.trim() == "") {alert("Habit needs a name"); return}
        if(completionDaysString == "" || completionDaysString == "0000000") {alert("Select days to complete the habit on"); return}
        if(selectedTypeIndex == -1) {alert("Select a habit type before creating a habit"); return}
        if(target == 0 && habitTypes[selectedTypeIndex] != "Normal" && noGoal == false) {alert("Habit daily goal can't be 0"); return}
        if(selectedEmojiIndex == -1) {alert("Select a habit emoji to continue"); return}
        if(noGoal) target = NO_GOAL_HABIT_TARGET

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
        <div className={`shadow-md shadow-gray-200 dark:shadow-none bg-panel1 outline-1 outline-border  max-w-[900px]  max-md:max-w-[500px] relative flex justify-center rounded-2xl flex-col items-center pb-4   p-4`}>
            <p className="  text-title font-semibold text-2xl mt-6 mb-8">
                Create New Habit
            </p>
            
            <div className={`flex w-full md:gap-10 md:pl-10 md:pr-10 max-md:flex-col max-md:items-center items-start `}>
                <div className="w-full flex justify-center flex-col items-center ">
                    <div className="w-[90%] max-w-[450px] mb-5">
                        <TextBoxLimited 
                            name="Habit Name"
                            value={name}
                            setValue={setName}
                            charLimit={30}
                            placeHolder="Enter habit name"/>
                    </div>
                    <div className="w-[90%] max-w-[450px] relative mb-5">
                        <TextBoxLimited
                            name="Habit Description"
                            value={description}
                            setValue={setDescription}
                            charLimit={200}
                            placeHolder="Enter habit description"
                            textArea={true}
                            custom={
                            <p className="absolute right-2 bottom-2 hover:cursor-pointer text-subtext2 bg-panel1"
                                onClick={async () => {
                                    triggerHaptic()
                                    loadingRef.current = 1
                                    await genDescription()
                                }}>
                                    {HC.loading && loadingRef.current == 1 ? <AiOutlineLoading className="animate-spin" size={12}/> : <RiAiGenerate size={14}/>}
                            </p>}/>
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
                                {Object.entries(compDays).map((e, _) => {
                                    return(
                                        <>
                                            <ButtonComp
                                                noAnimation={compact ? true: false}
                                                name={e[0][0].toUpperCase()}
                                                onSubmit={() => {setCompDays(prev => ({...prev, [e[0]]: !e[1]})); setCompsPerWeek(0)}}
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
                            alert("Normal: e.g. go to the gym its yes no \n Time Based: e.g Plank can log 13s \n Distance Based: e.g Walking you walked 12km \n Iteration Based: E.g drink 3 cups of water a day")
                        }}/>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-stretch mb-6 w-[90%] max-w-[450px]">
                        {habitTypes.map((h, i) => {
                        return(
                            <ButtonComp
                                noAnimation={compact ? true: false}
                                name={compact ?  h.split(" ")[0]: h}
                                highlight={selectedTypeIndex == i }
                                onSubmit={() => setSelectedTypeIndex(i)}
                                small={true}
                                style="grow-1"/>
                        )
                    })}
                    </div>
                    {habitTypes[selectedTypeIndex] != "Normal" &&  habitTypes[selectedTypeIndex] != undefined? 
                    <div className="w-[90%] mb-6  max-w-[450px]">
                        <p className="text-sm font-medium  text-subtext1 mb-2">Daily Goal</p>
                        {noGoal ? null :
                            habitTypes[selectedTypeIndex] == "Time Based" ? 
                                <TimeInput setDuration={setTime}/> 
                            : habitTypes[selectedTypeIndex] == "Distance Based" ? 
                                <DistanceInput setDistance={setDistance} distance={distance} />
                            : 
                                <NumberInput setAmount={setAmount} amount={amount} />
                        }
                        <div className="flex w-full items-center gap-2 justify-between mt-3 outline-1 rounded-md outline-border2 py-1.5 p-2">
                            <p className="text-xs font-medium text-subtext1">
                                No daily goal
                            </p>
                            <Switch ticked={noGoal} setStatus={setNoGoal}/>
                        </div>
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
                            <div className={`${compact ? "flex overflow-x-scroll gap-2  no-scrollbar rounded-md max-h-40 overflow-y-scroll no-scrollbar p-[1px]" : "flex flex-wrap max-h-40 overflow-y-scroll no-scrollbar p-[1px] rounded-md"}  md:flex-wrap gap-2 justify-stretch`} ref={emojiDiv}>
                                {habitEmojis.map((h, i) => {
                                    return(
                                        <>
                                            <ButtonComp
                                                noAnimation={compact ? true: false}
                                                name={h}
                                                onSubmit={() => setSelectedEmojiIndex(i)}
                                                highlight={selectedEmojiIndex == i}
                                                small={true}
                                                style="grow-1"/>
                                        </>
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
                    <ButtonComp
                        noAnimation={compact ? true: false}
                        name={HC.loading && loadingRef.current == 2 ? <AiOutlineLoading className="animate-spin" /> : "Create Habit"}
                        highlight={true}
                        onSubmit={async () => {
                            loadingRef.current = 2
                            await createHabit(); 
                            if(!onCreate) return
                            onCreate()
                        }}
                        style="w-full"/>
                </div>
            </div>
        </div>
    )
}
