import { useContext, useRef, useState } from "react"
import { UserContext } from "../components/Providers/UserProvider"
import InfoPanel from "../components/InfoPanel"
import { AuthContext } from "../components/Providers/AuthProvider"
import Model from "@/components/InputComponents/Model"
import Select, { type dataFormat } from "@/components/InputComponents/Select"
import { Origin, type SubmitIssueType } from "@/utils/types"
import { AlertContext } from "@/components/Alert/AlertProvider"
import { Util } from "@/utils/util"
import { AiOutlineLoading } from "react-icons/ai"
import { TiDelete } from "react-icons/ti"
import { triggerHaptic } from "tactus"
import Premium from "@/components/Premium"
import { useNavigate } from "react-router-dom"
import SettingsToggles from "@/components/SettingsToggles"

export default function SettingsPage() {

    const HC = useContext(UserContext)
    const auth = useContext(AuthContext)
    const navigate =useNavigate()
    const {alert} = useContext(AlertContext)
    const [openBug, setOpenBug] = useState(false)
    const [selectedPage, setSelectedPage] = useState<null | dataFormat>(null)
    const [selectedType, setSelectedType] = useState<null | dataFormat>(null)
    const [description, setDescription] = useState("")
    const [blur1, setBlur1] = useState(false)
    const [blur2, setBlur2] = useState(false)
    const bugs = Util.fetchAllMapItems(HC.issues)
    const btnClicked = useRef(0)


    const completions = Array.from(HC.habitsCompletions.values()).reduce((s, a) => s + Array.from(a.values()).length, 0)
    const goalComps = Array.from(HC.goalCompletions.values()).reduce((s, a) => s + Array.from(a.values()).length, 0)
    const pageItems = [{id:1, name: "Home Page"}, 
                       {id:2, name: "Log Page"},
                       {id:3, name: "Habits Page"},
                       {id:4, name: "Goals Page"},
                       {id:5, name: "Create Habit Page"},
                       {id:6, name: "Create Goal Page"},
                       {id:8, name: "HabitStudio Page"},
                       {id:7, name: "Settings Page"},
                       {id:9, name: "Other"}] as dataFormat[]

    const typeItems = [{id:1, name: "data not loading"}, 
                       {id:2, name: "layout issue"},
                       {id:3, name: "statistic is wrong"},
                       {id:4, name: "security issue"},
                       {id:5, name: "Feature request"},
                       {id:5, name: "other"},]

    async function submitBug(){
        if(selectedPage == null || selectedType == null){
            alert("Select a page and bug type before submiting")
            return
        }

        setDescription("")
        setSelectedPage(null)
        setSelectedType(null)
        await HC.lodgeIssue({page: selectedPage.name, type: selectedType.name, description} as SubmitIssueType)
    }
    return (
        <div className="flex flex-col justify-center mt-20 gap-3 items-center">
            <div className="shadow-md shadow-gray-200 dark:shadow-none bg-panel1 flex flex-col items-center rounded-2xl w-[90%] max-w-[600px]  p-5 outline-1 outline-border ">
                <p className="text-title text-xl font-semibold">
                    Settings 
                </p>
            </div>
            <InfoPanel>
                <InfoPanel.Title title="Acount"/>
                <InfoPanel.BodyContainer>
                    <InfoPanel.BubbleText text="Status:" bubbleText={`${Util.capitilizeFirst(auth.user?.role)}`} mb={4}/>
                    <InfoPanel.BubbleText text="AI Tokens:" bubbleText={`${auth.localUser?.tokens}`} mb={0}/>
                    <InfoPanel.SubText text={`Acount created: ${auth.user?.created_at}`}/>
                </InfoPanel.BodyContainer>
            </InfoPanel>
            <InfoPanel>
                <InfoPanel.Title title="Usage"/>
                <InfoPanel.BodyContainer>
                    <InfoPanel.SubText text={`Total Goal Amount: ${String(Array.from(HC.goals.values()).length)}/${auth.localUser?.role == "free" ? "30" : "500"}`}/>
                    <InfoPanel.SubText text={`Total Habit Amount: ${String(Array.from(HC.habits.values()).length)}/${auth.localUser?.role == "free" ? "30" : "500"}`}/>
                    <InfoPanel.SubText text={`Total habit completions: ${String(completions)}`}/>
                    <InfoPanel.SubText text={`Total goal completions: ${String(goalComps)}`}/>
                </InfoPanel.BodyContainer>
            </InfoPanel>
            <SettingsToggles/>
            <Premium/>
            <InfoPanel>
                <InfoPanel.Title title="Report Bug/Request Feature"/>
                <button className="shadow-sm hover:bg-neutral-100 shadow-gray-200 dark:shadow-none outline-1 rounded-xl py-1.5 text-sm outline-border2 text-subtext2 mt-4 hover:cursor-pointer dark:hover:bg-panel2/70 transition-all duration-250 ease-in-out"
                    onClick={() => {
                        triggerHaptic()
                        setOpenBug(true)
                    }}>
                    Report/Request
                </button>
            </InfoPanel>
            {bugs.length == 0 ? "" :
                <div className="shadow-md shadow-gray-200 dark:shadow-none outline-1 rounded-2xl outline-border bg-panel1 w-[90%] max-w-[600px] p-7 py-6 flex flex-col gap-5">
                    <p className="text-lg text-title font-medium mb-1">
                        Reports/Requests
                    </p>
                    <div className="flex flex-col gap-3">
                        {bugs.map((b, i) => {
                            return(
                                <div className="border-b-1 border-border2 pb-3 flex w-full justify-between items-center gap-4" key={i}>
                                    <div className="">
                                        <div className="flex items-center gap-1">
                                            <p className="text-sm text-subtext1 font-medium">
                                                Id: {b.id}
                                            </p>
                                            <p  className="text-subtext3 hover:cursor-pointer text-sm" onClick={async () => {
                                                triggerHaptic()
                                                btnClicked.current = 10 + i
                                                await HC.deleteIssue(b.id)
                                            }}>
                                                {HC.loading && btnClicked.current == 10 + i ? <AiOutlineLoading className="animate-spin"/>  : <TiDelete />} 
                                            </p>
                                        </div>
                                        <p className="text-subtext3 text-xs ">
                                            {b.description}
                                        </p>
                                        {b.response != "" ? 
                                        <p className="text-subtext3 text-xs">
                                            <b>Response:</b> {b.response}
                                        </p>
                                        : ""}
                                    </div>
                                        <p className={`text-xs text-btn-text ${b.status == "pending" ? "bg-red-500" : b.status == "reviewing" ? "bg-orange-500" : "bg-btn"} py-0.5 font-medium px-3 w-fit rounded-xl flex pb-1`}>
                                            {Util.capitilizeFirst(b.status)}
                                        </p>
                                </div>
                            )
                        })}
                    </div>
                </div>}
                <div className="w-full mb-10 flex justify-center">
                    <InfoPanel>
                        <InfoPanel.Title title="Policies"/>
                        <div className="flex mt-3 gap-3 max-sm:flex-col">
                            <p className="text-sm text-subtext3 underline hover:cursor-pointer" 
                                onClick={() => navigate("/terms")}>
                                Terms & Conditions
                            </p>
                            <p className="text-sm text-subtext3 underline hover:cursor-pointer" 
                                onClick={() => navigate("/refund")}>
                                Refund Policy
                            </p>
                            <p className="text-sm text-subtext3 underline hover:cursor-pointer" 
                                onClick={() => navigate("/priv")}>
                                Privacy Policy
                            </p>
                        </div>
                    </InfoPanel>
                </div>
            <Model open={openBug} onClose={() => setOpenBug(false)}>
                <div className="outline-1 rounded-2xl outline-border bg-panel1 w-[90%] max-w-[400px] p-7 py-6 flex flex-col gap-5" 
                    onClick={e => {
                        triggerHaptic()
                        setBlur1(true)
                        setBlur2(true)
                        e.stopPropagation()
                    }}>
                    <p className="text-xl text-title font-medium mb-1">
                        Description
                    </p>
                    <div className="flex gap-3 items-center">
                        <p className="text-subtext1 text-sm">
                            Page:
                        </p>
                        <div className="w-fit">
                            <Select items={pageItems} defaultText="Select" selectedItem={selectedPage} setSelectedItem={(id) => setSelectedPage(pageItems.find(p => p.id == id) ?? null)} origin={Origin.top} center={true} 
                            style="shadow-sm shadow-gray-200 dark:shadow-none outline-1 outline-border2 px-4 rounded-xl text-xs py-0.5 pb-1 text-subtext2 flex items-center" blur={blur1} setBlur={setBlur1} onBtnClick={() => setBlur2(true)}/>
                        </div>
                    </div>
                     <div className="flex gap-3 items-center">
                        <p className="text-subtext1 text-sm">
                            Type:
                        </p>
                        <div className="w-fit">
                            <Select items={typeItems} defaultText="Select" selectedItem={selectedType} setSelectedItem={(id) => setSelectedType(typeItems.find(p => p.id == id) ?? null)} origin={Origin.top} center={true} 
                            style="shadow-sm shadow-gray-200 dark:shadow-none outline-1 outline-border2 px-4 rounded-xl text-xs py-0.5 pb-1 text-subtext2 flex items-center" blur={blur2} setBlur={setBlur2} onBtnClick={() => setBlur1(true)}/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-subtext1 text-sm mb-0.5">
                            Description
                        </p>
                        <textarea
                        placeholder="Enter bug description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className={`shadow-sm shadow-gray-200 dark:shadow-none outline-1 text-[12px] h-20 rounded-xl resize-none w-full border-0  outline-border2 text-sm p-1.5 text-subtext1 px-2`} />
                    </div>
                    <div className="flex w-full gap-3">
                        <button className="bg-btn text-btn-text rounded-xl h-7 flex  justify-center items-center text-sm  py-1 w-full hover:cursor-pointer"
                            onClick={async () => {
                                triggerHaptic()
                               await submitBug()
                               setOpenBug(false)
                            }}>
                            {HC.loading ? <AiOutlineLoading className="animate-spin"/>  : "Submit"} 
                        </button>
                        <button className="bg-btn text-btn-text rounded-xl h-7  text-sm font- py-1 w-full hover:cursor-pointer"
                            onClick={() => {
                                triggerHaptic()
                                setOpenBug(false)
                            }}>
                            Exit
                        </button>
                    </div>
                </div>
            </Model>
        </div>
    )
}
