import { useContext, useEffect, useState } from 'react'
import { HabitTypeE, type HabitType } from '../utils/types'
import { HabitInputContext } from './InputBox/HabitInputProvider'
import { UserContext } from './UserProvider'
import { AiOutlineLoading } from "react-icons/ai";
import { dateUtils } from '../utils/dateUtils'
import ProgressBar from './InputComponents/ProgressBar';
import { HabitUtil } from '../utils/HabitUtil';
import { FaCheck } from "react-icons/fa6";
import { FaHourglassHalf } from "react-icons/fa";
import { Util } from '../utils/util';


interface HabitProps{
    habit: HabitType
    detailed: boolean
}
export default function HabitLogCard({habit: h, detailed}: HabitProps) {
    const [loading, setLoading] = useState(false)

    const HIC = useContext(HabitInputContext)
    const UC = useContext(UserContext)

    useEffect(() => {
        isCompletedToday()
    })

    async function HandleClick(){
        if(h.type != HabitTypeE.Normal){
            HIC.callbackRef.current = handleSubmit
            HIC.alert("", h.type as HabitTypeE, h.weeklyTarget, Number(h.target))
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

        const currentDate = new Date
        const isToday = completions.some(c => {
            const date = new Date(Number(c.date))
            return dateUtils.isDatesSameDay(date, currentDate)
        })

        if(!h.weeklyTarget) return HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id)) > Number(h.target)
        return isToday
    }
    function getLoadingColor(){
        return isCompletedToday() && isNormalHabit() ? "text-green-500" : "text-stone-500"
    }

    return (
        <div className='bg-stone-800 rounded-md w-[100%] max-w-[600px] font-mono overflow-auto'>
            <div className='flex justify-between items-center '>
                <p className='text-stone-200 p-3 pt-3 pb-2 text-lg'>
                    {h.icon} {Util.capitilizeFirst(h.name)} 
                </p>
                <div className='flex gap-2'>
                    
                    <button className={`h-7 flex justify-center 
                        items-center rounded-md p-2 mr-3 w-7 text-stone-200 
                        text-2xl hover:cursor-pointer
                        ease-in-out duration-150 ${isCompletedToday() ? "outline-green-400 outline-1  " : "outline-stone-500  outline-1 hover:outline-stone-400  active:bg-stone-800"}`}
                        onClick={HandleClick}>
                        {loading ? <AiOutlineLoading className={`animate-spin ${getLoadingColor()}`}/> : <FaCheck className={`${isCompletedToday() ? "text-green-400" : "text-stone-500" }`}/>}
                    </button>
                </div>
            </div>
            {detailed ? 
            !isNormalHabit()?
                <div className='ml-4 mr-3 mb-3 flex  gap-2 flex-col'>
                    <div className='w-full'>
                        {h.weeklyTarget ? 
                        <div className=''>
                            <ProgressBar 
                                min={0} 
                                max={Number(h.target)} 
                                current={HabitUtil.getCompletionValueSumWeek(UC.habitsCompletions.get(h.id))}/>
                        </div>
                        : 
                        <div className=''>
                            <ProgressBar 
                                min={0} 
                                max={Number(h.target)} 
                                current={HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}/>
                        </div>}
                    </div>
                    <div className='flex items-center gap-2 mt-1 flex-wrap justify-stretch'>   
                        <p className='text-stone-400 whitespace-nowrap  font-mono text-[11px]'>
                            {Math.round(HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))/Number(h.target)*100*100)/100}% |
                        </p>
                        <p className='text-stone-400 whitespace-nowrap overflow-ellipsis font-mono text-[11px] bg-stone-600 rounded-full pl-1 pr-1 font-extrabold'>
                          {h.weeklyTarget ? "W" : "D"} 
                        </p>
                        <p className='text-stone-400 whitespace-nowrap overflow-ellipsis font-mono text-[11px]'>
                             [{h.weeklyTarget ? 
                                HabitUtil.pretifyData(`${HabitUtil.getCompletionValueSumWeek(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE): 
                                HabitUtil.pretifyData(`${HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}]/[{HabitUtil.pretifyData(h.target, h.type as HabitTypeE)}]
                        </p>
                        <p className='text-stone-400 whitespace-nowrap overflow-ellipsis font-mono text-[11px]'>
                            | {HabitUtil.getCompletionDaysString(h.completionDays)}
                        </p>
                        <p className='text-stone-400 whitespace-nowrap overflow-ellipsis font-mono text-[9px]'>
                            {HabitUtil.isCompleteableToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                        </p>
                    </div>
                </div>
            : 
            <div className='ml-4 mr-3 mb-3 flex  gap-2 '>
                <p className='text-stone-400 font-mono text-[11px]'>
                    Completions Days: {HabitUtil.getCompletionDaysString(h.completionDays)}
                </p>
                <p className='text-stone-400 font-mono text-[9px] flex items-center'>
                   {HabitUtil.isCompleteableToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                </p>
            </div>: ""}
            {}
        </div>
    )
}
