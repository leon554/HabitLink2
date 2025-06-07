import {useContext, useState } from "react";
import NumericInput from "./InputComponents/NumericInput";
import { IoInformationCircleOutline } from "react-icons/io5";
import { AlertContext } from "./Alert/AlertProvider";
import { UserContext } from "./UserProvider";
import { AiOutlineLoading } from "react-icons/ai";
import TimeInput from "./InputComponents/TimeInput";
import DistanceInput from "./InputComponents/DistanceInput";
import NumberInput from "./InputComponents/NumberInput";




export default function Create() {
    const [compsPerWeek, setCompsPerWeek] = useState(0)
    const [compDays, setCompDays] = useState({mon: false, teu: false, wed: false, thu: false, fri: false, sat: false, sun: false})
    const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1)
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(-1)
    const [name, setName] = useState("")
    const [time, setTime] = useState(0)
    const [distance, setDistance] = useState(0)
    const [amount, setAmount] = useState(0)
    const [description, setDescription] = useState("")
    const habitEmojis = ["💪","📖","🧘","📝","🥗","🚰","😴","📚","🏃","🧹","🛏️","🪥","💻","🎨","🎵","☀️","📅","💸","📵","🧼","🧊","🏋️","🧠","🎯","👣","🍎","🚭","🍵","🌿","🕯️","👨‍🍳","🚿","🪑","🐶","🤝"];
    const habitTypes = ["Normal", "Time Based", "Distance Based", "Iteration Based"]

    const {alert} = useContext(AlertContext)
    const user = useContext(UserContext)

    async function createHabit(){
        //add check if everything is filled in
        const completionDaysString = (compsPerWeek == 0) ? getCompDaysString() : `${compsPerWeek}`
        await user.createHabit(name, description, completionDaysString, habitEmojis[selectedEmojiIndex], habitTypes[selectedTypeIndex], getTarget())
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
    return (
        <div className="bg-stone-800 max-md:max-w-[400px]  max-w-[900px] mt-20 w-[95%] flex justify-center rounded-md flex-col items-center pb-5 font-mono">
            <p className="font-mono text-stone-200 font-semibold text-2xl mt-8 mb-8">
                Create New Habit
            </p>
            <div className="flex w-full md:gap-10 md:pl-10 md:pr-10 max-md:flex-col max-md:items-center items-start">
                <div className="w-full flex justify-center flex-col items-center ">
                    <div className="max-md:w-[70%] w-full font-mono mb-5">
                        <p className="text-[16px]  text-stone-100 mb-2">Habit Name</p>
                        <input type="text" 
                        placeholder="Enter habit name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="outline-1 text-[12px] rounded-md w-full border-0  outline-stone-600 text-sm p-1.5 text-gray-200 mb-1" />
                    </div>
                    <div className="max-md:w-[70%] w-full font-mono mb-5">
                        <p className="text-[16px]  text-stone-100 mb-2">Habit Description</p>
                        <textarea
                        placeholder="Enter habit description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="outline-1 text-[12px] h-20 rounded-md resize-none w-full border-0  outline-stone-600 text-sm p-1.5 text-gray-200" />
                    </div>
                    <div className="max-md:w-[70%] w-full font-mono  flex justify-center flex-col items-stretch ">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-[16px]  text-stone-100">Completion Days </p> 
                                <IoInformationCircleOutline size={14} color="#f5f5f4" className="hover:cursor-pointer" onClick={() => {
                                    alert("You can either choose specific days of the week to complete your habit, or set a target number of completions per week, regardless of which days they fall on.")
                                }}/>
                            </div>
                            <div className=" flex justify-stretch gap-2">
                                {Object.entries(compDays).map((e, i) => {
                                    return(
                                        <button className={`${e[1] ? "bg-green-400" : "bg-stone-800" }  ${e[1] ? "text-stone-900" : "text-stone-400" } ${e[1] ? "outline-0" : "outline-1" } grow-1 pl-2 pr-2 rounded-md outline-stone-600 text-stone-400 hover:cursor-pointer   ease-in-out duration-75`}
                                            onClick={() => {setCompDays(prev => ({...prev, [e[0]]: !e[1]})); setCompsPerWeek(0)}}
                                            key={i}>
                                            {e[0][0].toUpperCase()}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="flex items-center  gap-3 mt-2 mb-5 ">
                            <p className="text-stone-400 text-sm font-mono">Or</p>
                            <div onClick={() => setCompDays({mon: false, teu: false, wed: false, thu: false, fri: false, sat: false, sun: false})}>
                                <NumericInput value={compsPerWeek} setValue={setCompsPerWeek} increment={1} min={0} max={7}/>
                            </div>
                            <p className="text-stone-400 text-sm self-center mt-2 mb-3 font-mono">days per week</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2 max-md:w-[70%] w-full">
                        <p className="text-[16px]  text-stone-100">Habit Type </p> 
                        <IoInformationCircleOutline size={14} color="#f5f5f4" className="hover:cursor-pointer" onClick={() => {
                            alert("Normal: e.g. go to the gym its yes no \n Time Based: e.g Plank can log 13s \n Distance Based: e.g Walking you walked 12km \n Itteration Based: E.g drink 3 cups of water a day")
                        }}/>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-stretch mb-6 max-md:w-[70%] w-full">
                        {habitTypes.map((h, i) => {
                        return(
                            <button className={`${selectedTypeIndex == i ? "outline-0 bg-green-400 text-stone-900" : "bg-stone-800 outline-1"} rounded-md outline-stone-600 p-1 grow-1 hover:cursor-pointer hover:bg-green-400 hover:outline-0 text-stone-400 text-sm hover:text-stone-900`}
                                onClick={() => setSelectedTypeIndex(i)} key={i}>
                                {h}
                            </button>
                        )
                    })}
                    </div>
                    {habitTypes[selectedTypeIndex] != "Normal" &&  habitTypes[selectedTypeIndex] != undefined? <div className="max-md:w-[70%] mb-6 w-full">
                        <p className="text-[16px]  text-stone-100 mb-2">Daily Goal</p>
                        
                        {habitTypes[selectedTypeIndex] == "Time Based" ? 
                            <TimeInput setDuration={setTime}/> 
                        : habitTypes[selectedTypeIndex] == "Distance Based" ? 
                            <DistanceInput setDistance={setDistance} distance={distance} />
                        : 
                            <NumberInput setAmount={setAmount} amount={amount} />
                        }
                    </div> : ""}
                </div>

                <div className="w-[70%]  font-mono mb-7  ">
                    <p className="text-[16px]  text-stone-100 mb-2">Habit Emoji</p>
                    <div className="flex flex-wrap gap-2 justify-stretch mb-6">
                        {habitEmojis.map((h, i) => {
                            return(
                                <button className={`${selectedEmojiIndex == i ? "outline-0 bg-green-400" : "bg-stone-800 outline-1"} rounded-md outline-stone-600 p-1 grow-1 hover:cursor-pointer hover:bg-green-400 hover:outline-0`}
                                    onClick={() => setSelectedEmojiIndex(i)} key={i}>
                                    {h}
                                </button>
                            )
                        })}
                    </div>
                    
                    <button className=" w-full rounded-md p-1 bg-green-400 mb-6 font-mono hover:cursor-pointer mt-7 flex justify-center h-8 items-center"
                        onClick={() => createHabit()}>
                        {user.loading ? <AiOutlineLoading className="animate-spin" /> : "Create Habit"}
                    </button>
                </div>
            </div>
        </div>
    )
}
