import { useContext, useState } from "react"
import { IoInformationCircleOutline } from "react-icons/io5";
import { AlertContext } from "./Alert/AlertProvider";
import { UserContext } from "./Providers/UserProvider";
import Model from "./InputComponents/Model";
import { AiOutlineLoading } from "react-icons/ai";
import { add } from "date-fns";
import { FaLink } from "react-icons/fa";


export default function CreateGoal() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(-1)
    const [startValue, setStartValue] = useState("")
    const [goalValue, setGoalValue] = useState("")
    const [days, setDays] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [selectHabits, setSelectedHabits] = useState<number[]>([])
    const habitTypes = ["Normal", "Time Based", "Distance Based", "Iteration Based"]
    const [linkedID, setLinkedId] = useState(-1)

    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)

    async function submit(){
        const type = (linkedID == -1) ? habitTypes[selectedTypeIndex] : HC.habits.get(linkedID)?.type
        if(!type) {alert("Error linked habit type is undefined"); return}
        await HC.createGoal(name, description, type, Number(startValue), Number(goalValue), selectHabits, add(new Date(), {days: days}), linkedID)
        setName(""); setDescription(""); setSelectedTypeIndex(-1); setStartValue(""); setGoalValue(""); setSelectedHabits([]); setDays(1)
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
    return (
        <div className="rounded-md bg-stone-800 flex p-4 text-stone-200 font-mono  max-md:max-w-[500px] max-w-[900px] w-[90%] flex-col items-center relative">
            <p className="text-2xl mt-4 mb-7 font-semibold md:mb-10">
                Create Goal 🎯
            </p>
            <div className="flex max-md:flex-col  w-full">
                <div className="w-full flex flex-col items-center ">
                    
                    <div className="w-[90%] max-w-[450px]  font-mono mb-5 ">
                        <p className="text-[16px]  text-stone-100 mb-2">Goal Name</p>
                        <input type="text" 
                        placeholder="Enter goal name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="outline-1 text-[12px] rounded-md w-full border-0  outline-stone-600 text-sm p-1.5 text-gray-200 mb-1" />
                    </div>
                    <div className="w-[90%] max-w-[450px]  font-mono mb-5">
                        <p className="text-[16px]  text-stone-100 mb-2">Goal Description</p>
                        <textarea
                        placeholder="Enter goal description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="outline-1 text-[12px] h-20 rounded-md resize-none w-full border-0  outline-stone-600 text-sm p-1.5 text-gray-200" />
                    </div>

                    <div className="w-[90%] max-w-[450px]  font-mono mb-6">
                        <p className="text-[16px]  text-stone-100 mb-2">Associated Habits</p>
                        <button className={`outline-1 rounded-md outline-stone-600 w-full p-1 grow-1 hover:cursor-pointer hover:bg-green-400 hover:outline-0 text-stone-400 text-sm hover:text-stone-900`}
                                onClick={() => setShowModal(true)}>
                                {selectHabits.length == 0 ? "Select Habits" : `${selectHabits.length + ((linkedID != -1) ? 1 : 0)} habits associated${(linkedID != -1) ? ", 1 Linked" : ""}`}
                        </button>
                        <Model open={showModal} onClose={() => setShowModal(false)}>
                            <div className="p-3 w-full flex flex-col  items-center  ">
                                <p className="mb-4 mt-2 text-xl select-none">
                                    Select Habits
                                </p>
                                <div className="flex flex-col gap-2 mb-3 items-stretch w-[90%] max-h-[400px] overflow-y-scroll no-scrollbar rounded-md">
                                    {Array.from(HC.habits.values()).map((h, i) => {
                                        return(
                                            <div className={`bg-stone-700/40 rounded-md w-full hover:cursor-pointer select-none flex justify-between  h-10`} key={i} 
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
                                                <div className="flex">
                                                    <div className={`h-[100%] w-2 ${selectHabits.includes(Number(h.id)) ? "bg-green-400" : Number(h.id) == linkedID ? "bg-blue-400" : "bg-stone-700"}  rounded-l-md`}>
                                                    </div>
                                                    <p className="p-2">
                                                        {h.icon} {h.name}
                                                    </p>  
                                                </div>
                                                <div className="flex items-center mr-2 text-xs">
                                                   {Number(h.id) == linkedID ? <FaLink className="text-stone-400"/> : ""} 
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <button className="bg-green-400 w-[90%] rounded-md text-stone-800 mb-5 mt-2 h-8 hover:cursor-pointer" 
                                    onClick={() => setShowModal(false)}>
                                    Done
                                </button>
                            </div>
                        </Model>
                    </div>
                   
                </div>

                <div className="w-full flex flex-col items-center">
                    {linkedID == -1?
                    <div className="w-full flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2 w-[90%] max-w-[450px]">
                            <p className="text-[16px]  text-stone-100">Goal Type </p> 
                            <IoInformationCircleOutline size={14} color="#f5f5f4" className="hover:cursor-pointer" onClick={() => {
                                alert("Normal: e.g. go to the gym its yes no \n Time Based: e.g Plank can log 13s \n Distance Based: e.g Walking you walked 12km \n Itteration Based: E.g drink 3 cups of water a day")
                            }}/>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-stretch mb-6 w-[90%] max-w-[450px]">
                            {habitTypes.map((h, i) => {
                            return(
                                <button className={`${selectedTypeIndex == i ? "outline-0 bg-green-400 text-stone-900" : "bg-stone-800 outline-1"} rounded-md outline-stone-600 p-1 grow-1 hover:cursor-pointer hover:bg-green-400 hover:outline-0 text-stone-400 text-sm hover:text-stone-900`}
                                    onClick={() => setSelectedTypeIndex(i)} key={i}>
                                    {h}
                                </button>
                            )
                        })}
                        </div>
                        {habitTypes[selectedTypeIndex] != "Normal" &&  habitTypes[selectedTypeIndex] != undefined? <div className="w-[90%] max-w-[450px] mb-6">
                            <p className="text-[16px]  text-stone-100 mb-2">Start Value</p>
                            
                            <input type="text" 
                                    placeholder={"Enter start " + getPlaceHolderText()}
                                    value={startValue}
                                    onChange={e => setStartValue(e.target.value)}
                                    className="outline-1 text-[12px] rounded-md w-full border-0  outline-stone-600 text-sm p-1.5 text-gray-200 mb-1" />
                        </div> : ""}

                        {habitTypes[selectedTypeIndex] != "Normal" &&  habitTypes[selectedTypeIndex] != undefined? <div className="w-[90%] max-w-[450px] mb-6">
                            <p className="text-[16px]  text-stone-100 mb-2">Goal Value</p>
                            <input type="text" 
                                    placeholder={"Enter goal " + getPlaceHolderText()}
                                    value={goalValue}
                                    onChange={e => setGoalValue(e.target.value)}
                                    className="outline-1 text-[12px] rounded-md w-full border-0  outline-stone-600 text-sm p-1.5 text-gray-200 mb-1" />
                        </div> : ""}
                    </div>: 
                    <div className="w-full flex flex-col items-center">
                        <div className="w-[90%] max-w-[450px] mb-6">
                            <p className="text-[16px]  text-stone-100 mb-2">Goal Value</p>
                            <input type="text" 
                                    placeholder={"Enter goal " + getLinkedPlaceHolderText()}
                                    value={goalValue}
                                    onChange={e => setGoalValue(e.target.value)}
                                    className="outline-1 text-[12px] rounded-md w-full border-0  outline-stone-600 text-sm p-1.5 text-gray-200 mb-1" />
                        </div>
                    </div>}

                    <div className="w-[90%] max-w-[450px]  font-mono mb-8">
                        <p className="text-[16px]  text-stone-100 mb-2">Complete Goal In</p>
                        <div className="flex font-mono p-1 gap-2 rounded-md text-sm outline-1 outline-stone-600 justify-stretch">
                            <div className="flex items-center  grow-1">
                                <p className="text-stone-400 pl-1 pr-2 w-23 overflow-hidden">
                                    {days} Days
                                </p>
                                <input
                                    type="range"
                                    min="1"
                                    max={365}
                                    value={days}
                                    onChange={e => setDays(Number(e.target.value))}
                                    className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer slider-thumb mr-1"
                                />
                            </div>
                        </div>
                        <div className="flex justify-stretch w-full gap-4 mt-3">
                            <button className="outline-1 rounded-md outline-stone-600 p-1 grow-1 hover:cursor-pointer hover:bg-green-400 hover:outline-0 text-stone-400 text-sm hover:text-stone-900" 
                                onClick={() => setDays(p => p - 1)}>
                                -
                            </button>
                            <button className="outline-1 rounded-md outline-stone-600 p-1 grow-1 hover:cursor-pointer hover:bg-green-400 hover:outline-0 text-stone-400 text-sm hover:text-stone-900"
                                onClick={() => setDays(p => p + 1)}>
                                +
                            </button>
                        </div>
                    </div>


                    <button className="bg-green-400 text-stone-800 hover:cursor-pointer rounded-md w-[90%] max-w-[450px] py-1 mb-6 h-9 flex justify-center items-center" 
                        onClick={submit}>
                        {HC.loading ? <AiOutlineLoading className="animate-spin" /> : "Create Goal"}
                    </button>
                </div>
            </div>
        </div>
    )
}
