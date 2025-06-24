import { useContext, useEffect, useState } from 'react'
import { HabitTypeE, type HabitType } from '../utils/types'
import { UserContext } from './Providers/UserProvider'
import { AiOutlineLoading } from "react-icons/ai";
import { dateUtils } from '../utils/dateUtils'
import ProgressBar from './InputComponents/ProgressBar';
import { HabitUtil } from '../utils/HabitUtil';
import { FaCheck } from "react-icons/fa6";
import { FaHourglassHalf } from "react-icons/fa";
import { Util } from '../utils/util';
import Model from './InputComponents/Model';
import HabitLogPopUp from './HabitLogPopUp';
import { AlertContext } from './Alert/AlertProvider';
import { SettingsContext } from './Providers/SettingsProvider';



interface HabitProps{
    habit: HabitType
}
export default function HabitLogCard({habit: h}: HabitProps) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<number>(0)

    const {alert} =  useContext(AlertContext)
    const UC = useContext(UserContext)
    const {settings} = useContext(SettingsContext)
    

    useEffect(() => {
        isCompletedToday()
    })

    async function HandleClick(){
        if(h.type != HabitTypeE.Normal){
            setOpen(true)
        }else{
            setLoading(true)
            if(isCompletedToday()){
                await UC.removeTodaysHabitCompletion(h.id)
            }else{
                await UC.compleHabit(h.id, 1)
            }
            setLoading(false)
        }
    }
    async function handleSubmit(value: number){
        await UC.compleHabit(h.id, value)
    }

    function isNormalHabit(){
        return h.type == HabitTypeE.Normal
    }
    function isCompletedToday(){
        const completions = UC.habitsCompletions.get(h.id)
        if(!completions) return false

        const currentDate = new Date()
        const isToday = completions.some(c => {
            const date = new Date(Number(c.date))
            return dateUtils.isDatesSameDay(date, currentDate)
        })

        if(h.type != HabitTypeE.Normal) return HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id)) >= Number(h.target)
        return isToday
    }
    function getLoadingColor(){
        return isCompletedToday() && isNormalHabit() ? "text-green-500" : "text-stone-500"
    }

    return (
        <div className='bg-panel1 dark:bg-panel1 dark:border-border border-border border-1 rounded-2xl w-[100%] max-w-[600px] font-mono overflow-auto'>
            <div className='flex justify-between items-center'>
                <p className={`text-title dark:text-title p-3 pt-3 ${settings.showDetails ? "pb-2" : ""} text-lg flex gap-2.5 items-center`}>
                    {settings.showRanks ? 
                    <img src={UC.habitRanks.get(h.id)} alt="" className="w-4.5"/>
                    : h.icon} {Util.capitilizeFirst(h.name)} 
                </p>
                <div className='flex gap-4 items-center'>
                    <div className='flex items-center gap-1'>
                        {!settings.showDetails && !isNormalHabit()? 
                        <p className='text-subtext1 dark:text-subtext2 font-mono text-[11px] '>
                                [{Util.pretifyData(`${HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}]/[{Util.pretifyData(h.target, h.type as HabitTypeE)}]
                        </p> : ""}
                        {!settings.showDetails ? 
                        <p className='text-subtext1 dark:text-subtext2 font-mono text-[9px] pb-0.5'>
                                {HabitUtil.isCompleteableToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                        </p>: ""}
                    </div>
                    <button className={`h-7 flex justify-center 
                        items-center rounded-lg p-2 mr-3 w-7 text-subtext1
                        text-2xl hover:cursor-pointer
                        ease-in-out duration-150 ${isCompletedToday() ? "dark:outline-highlight outline-highlight outline-1  " : "outline-subtext1 dark:outline-subtext2 outline-1 hover:outline-stone-400  active:bg-stone-800"}`}
                        onClick={HandleClick}>
                        {loading ? <AiOutlineLoading className={`animate-spin ${getLoadingColor()}`}/> : <FaCheck className={`${isCompletedToday() ? "dark:text-highlight text-highlight" : "text-subtext2 dark:text-subtext2" }`}/>}
                    </button>
                    <Model open={open} onClose={() => setOpen(false)}>
                        <div onClick={e => e.stopPropagation()}>
                            <HabitLogPopUp habit={h} onExit={() => setOpen(false)} value={value} setValue={setValue}
                                onSubmit={async () => {
                                    await handleSubmit(value)
                                    alert("Succes, Well Done! 🎉🎉🎉")
                                }} />
                        </div>
                    </Model>
                </div>
            </div>
            {settings.showDetails ? 
            !isNormalHabit()?
                <div className='ml-4 mr-3 mb-3 flex  gap-2 flex-col'>
                    <div className='w-full'>
                        <div className=''>
                            <ProgressBar 
                                min={0} 
                                max={Number(h.target)} 
                                current={HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}/>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 mt-1 flex-wrap justify-stretch'>   
                        <p className='text-subtext2 dark:text-subtext2  font-mono text-[11px]'>
                            {Math.round(HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))/Number(h.target)*100*100)/100}% |
                        </p>
                        <p className='text-subtext2 dark:text-subtext2 font-mono text-[11px]'>
                             [{Util.pretifyData(`${HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}]/[{Util.pretifyData(h.target, h.type as HabitTypeE)}]
                        </p>
                        <p className='text-subtext2 dark:text-subtext2 font-mono text-[11px]'>
                            | {HabitUtil.getCompletionDaysString(h.completionDays)}
                        </p>
                        <p className='text-subtext2 dark:text-subtext2 font-mono text-[9px]'>
                            {HabitUtil.isCompleteableToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                        </p>
                    </div>
                </div>
            : 
            <div className='ml-4 mr-3 mb-3 flex  gap-2 '>
                <p className='text-subtext2 dark:text-subtext2 font-mono text-[11px]'>
                    Completions Days: {HabitUtil.getCompletionDaysString(h.completionDays)}
                </p>
                <p className='text-subtext2 dark:text-subtext2 font-mono text-[9px] flex items-center'>
                   {HabitUtil.isCompleteableToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                </p>
            </div>: ""}
            {}
        </div>
    )
}
