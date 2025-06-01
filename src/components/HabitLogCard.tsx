import { useContext, useEffect, useState } from 'react'
import { HabitTypeE, type HabitType } from '../utils/types'
import { HabitInputContext } from './InputBox/HabitInputProvider'
import { UserContext } from './UserProvider'
import { AiOutlineLoading } from "react-icons/ai";
import { dateUtils } from '../utils/dateUtils'
import ProgressBar from './InputComponents/ProgressBar';
import { CompUtil } from '../utils/completionsUtil';


interface HabitProps{
    habit: HabitType
}
export default function HabitLogCard({habit: h}: HabitProps) {
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
        return isToday
    }
    function getLoadingColor(){
        return isCompletedToday() && isNormalHabit() ? "text-stone-800" : "text-stone-200"
    }
    function isNonNormalHabitComplete(){
        if(h.weeklyTarget){
            return CompUtil.getCompletionValueSumWeek(UC.habitsCompletions.get(h.id)) > Number(h.target)
        }
        return CompUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id)) > Number(h.target)
    }
    return (
        <div className='bg-stone-800 rounded-md w-[100%] max-w-[600px] font-mono overflow-auto'>
            <div className='flex justify-between items-center '>
                <p className='text-stone-200 p-3 pt-4 pb-4 text-lg'>
                    {h.icon} {h.name} 
                </p>
                <div className='flex gap-2'>
                    
                    <button className={`outline-stone-500 h-7 flex justify-center 
                        items-center rounded-md p-2 mr-3 w-7 text-stone-200 
                        text-2xl hover:cursor-pointer
                        ease-in-out duration-150 ${(isCompletedToday() && isNormalHabit()) || isNonNormalHabitComplete() ? "bg-green-400 outline-0 w-8 h-8 " : " outline-1 hover:outline-stone-400  active:bg-stone-800"}`}
                        onClick={HandleClick}>
                        {loading ? <AiOutlineLoading className={`animate-spin ${getLoadingColor()}`}/> : ""}
                    </button>
                </div>
            </div>
            {!isNormalHabit() ?
                <div className='ml-4 mr-3 mb-3 flex items-center gap-2'>
                    <p className='text-stone-600 font-mono text-xs bg-green-400 rounded-full pl-1 pr-1 font-extrabold'>
                        {h.weeklyTarget ? "W" : "D"}
                    </p>
                    <div className='grow-2'>
                        {h.weeklyTarget ? 
                        <div className=''>
                            <ProgressBar 
                                min={0} 
                                max={Number(h.target)} 
                                current={CompUtil.getCompletionValueSumWeek(UC.habitsCompletions.get(h.id))}/>
                        </div>
                        : 
                        <div className=''>
                            <ProgressBar 
                                min={0} 
                                max={Number(h.target)} 
                                current={CompUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}/>
                        </div>}
                    </div>
                    <div className='flex items-center gap-2 w-fit'>   
                        <p className='text-stone-400 font-mono text-xs'>
                            {Math.round(CompUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))/Number(h.target)*100*100)/100}%
                        </p>
                        <p className='text-stone-400 font-mono text-xs'>
                            | Goal: {CompUtil.pretifyData(h.target, h.type as HabitTypeE)}
                        </p>
                        <p className='text-stone-400 font-mono text-xs'>
                            | Current: {h.weeklyTarget ? 
                                CompUtil.pretifyData(`${CompUtil.getCompletionValueSumWeek(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE): 
                                CompUtil.pretifyData(`${CompUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}
                        </p>
                    </div>
                </div>
            : ""}
        </div>
    )
}
