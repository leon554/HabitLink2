import { AiOutlineLoading } from "react-icons/ai"
import { TbPlayerSkipForwardFilled } from "react-icons/tb"
import ButtonComp from "./primatives/ButtonComp"
import { useContext, useState } from "react"
import { UserContext } from "./Providers/UserProvider"
import type { HabitType } from "@/utils/types"
import { HabitUtil } from "@/utils/HabitUtil"
import Select from "./InputComponents/Select"
import TextBoxLimited from "./primatives/TextBoxLimited"
import { AlertContext } from "./Alert/AlertProvider"

interface Props{
    setOpenSkip: (open: boolean) => void
    habit: HabitType
}
export default function SkipNotePanel({setOpenSkip, habit: h} : Props) {
    
    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)

    const [loading, setLoading] = useState(false)
    const [selectedId, setSelectedId] = useState(0)
    const [blur, setBlur] = useState(false)
    const [note, setNote] = useState("")

    const entries = HC.habitsCompletions.get(h.id)
    const selectionItems = [
        {id: 0, name: "Skip"}, 
        {id: 1, name: "Add Note"}
    ]
    
    async function handleSkip(){
        if(loading) return
        setLoading(true)
        await HC.removeTodaysHabitCompletion(h.id)
        if(!HabitUtil.isSkippedToday(entries, h)){
            await HC.completeHabit(h.id, h.target, true)
        }
        setLoading(false)
    }
    async function addNote() {
        if(loading) return
        if(entries?.length == 0){
            alert("Please add a entry first before adding a note")
            return
        }
        if(note == ""){
            alert("Please add text in the text box before adding a note")
            return
        }
        setLoading(true)
        await HC.addNote(note, h.id)
        setLoading(false)
        setNote("")
        setOpenSkip(false)
    }

    return (
        <div className='w-[90%] max-w-[400px] bg-panel1 p-7 rounded-2xl outline-1 outline-border flex flex-col gap-3' onClick={e => {
            e.stopPropagation()
            setBlur(true)
        }}>
            <div className="flex justify-between">
                <p className='text-title font-semibold'>
                    {selectedId == 0 ? "Skip Habit Today" : "Add Note"}
                </p>
                <div className="flex gap-1.5 items-center mb-2">
                        <Select items={selectionItems}
                            selectedItem={selectionItems[selectedId]} 
                            setSelectedItem={(id) => setSelectedId(id)}
                            blur={blur}
                            setBlur={setBlur}
                            showIcon={true}
                            style="shadow-sm bg-panel2 shadow-gray-200 dark:shadow-none text-xs  text-subtext3 px-2 py-0.5 rounded-lg border-1 border-border2 z-10"/>
                    
                </div>
            </div>
            {selectedId == 0 ? 
            <>
                <p className='text-subtext2 text-xs'>
                    This will skip your habit today without loosing your streak or other related stats.
                </p>
                    <p className='text-subtext2 text-xs'>
                    Note: if you skip this habit it will remove all other entries for this habit that happened today.
                </p>
                <div className='flex items-center w-full mt-2 gap-4'>
                    <ButtonComp
                        name={<>
                            {loading ? (
                            <AiOutlineLoading className={`animate-spin text-btn-text`} />
                            ) : (
                                HabitUtil.isSkippedToday(entries, h) ? "UnSkip" : "Skip"
                            )}
                            {!HC.loading && <TbPlayerSkipForwardFilled />}
                        </>}
                        highlight={true}
                        noAnimation={true}
                        style='w-full'
                        short={true}
                        onSubmit={async () => {
                            await handleSkip()
                            setOpenSkip(false)
                        }}/>
                    <ButtonComp
                        name={"Exit"}
                        noAnimation={true}
                        short={true}
                        highlight={false}
                        onSubmit={() => setOpenSkip(false)}/>

                </div>
            </> :
            <>
                <p className='text-subtext2 text-xs mb-1'>
                    Note when you add a note it will attach your note to your most recent entry for this habit regardless if its a skip or completion.
                </p>
                <TextBoxLimited
                    name="Enter Note"
                    charLimit={400}
                    placeHolder="Enter note..."
                    textArea={true}
                    value={note}
                    setValue={setNote}
                    />
                <div className='flex items-center w-full mt-2 gap-4'>
                    <ButtonComp
                        name={<>
                            {loading ? (
                            <AiOutlineLoading className={`animate-spin text-btn-text`} />
                            ) : (
                                "Add Note" //check if user has entries for the habit first
                            )}
                        </>}
                        highlight={true}
                        noAnimation={true}
                        style='w-full'
                        short={true}
                        onSubmit={async () => {
                            await addNote()
                            setOpenSkip(false)
                        }}/>
                    <ButtonComp
                        name={"Exit"}
                        noAnimation={true}
                        short={true}
                        highlight={false}
                        onSubmit={() => setOpenSkip(false)}/>
                </div>
            </>}
        </div>
    )
}
