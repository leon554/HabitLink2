import { useContext, useEffect, useState } from 'react'
import { HabitTypeE, type HabitType } from '../utils/types'
import { UserContext } from './Providers/UserProvider'
import { AiOutlineLoading } from "react-icons/ai";
import { dateUtils } from '../utils/dateUtils'
import { HabitUtil } from '../utils/HabitUtil';
import { FaCheck } from "react-icons/fa6";
import { FaHourglassHalf } from "react-icons/fa";
import { Util } from '../utils/util';
import Model from './InputComponents/Model';
import HabitLogPopUp from './HabitLogPopUp';
import { AlertContext } from './Alert/AlertProvider';
import { SettingsContext } from './Providers/SettingsProvider';
import { useNavigate } from 'react-router-dom';
import useCurrentGoalValue from './Hooks/useCurrentGoalValue';
import type { GoalType } from '../utils/types';
import { triggerHaptic } from "tactus";
import { GoKebabHorizontal } from "react-icons/go";
import { FiClipboard } from "react-icons/fi";
import { TbPlayerSkipForwardFilled } from "react-icons/tb";
import { IoFlame } from 'react-icons/io5';
import SkipNotePanel from './SkipNotePanel';
import { NO_GOAL_HABIT_TARGET } from '@/utils/Constants';


interface HabitProps{
    habit: HabitType
}
export default function HabitLogCard({habit: h}: HabitProps) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [openSkip, setOpenSkip] = useState(false)
    const [value, setValue] = useState<number>(0)

    const {alert} =  useContext(AlertContext)
    const UC = useContext(UserContext)
    const {settings} = useContext(SettingsContext)
    const navigate = useNavigate()
    const entries = UC.habitsCompletions.get(h.id)

    useEffect(() => {
        isCompletedToday()
    }, [])



    const startValue = UC.getCurrentGoal()?.startValue ?? 0
    const currenValue = useCurrentGoalValue()
    const targetValue = UC.getCurrentGoal()?.targetValue ?? 0
    const isGoalFinished =  Util.calculateProgress(startValue, currenValue, targetValue) >= 1;

    useEffect(() => {
        const updateGoal = async () => {
            if(isGoalFinished){
                await UC.compleGoal(UC.currentGaol ?? -1)
                const updated = Util.updateMap(UC.goals, UC.currentGaol!, {...UC.getCurrentGoal(), completed: true} as GoalType)
                UC.setGaols(updated)
            }
        }
        updateGoal()
    }, [isGoalFinished])
    
    async function HandleClick(){
        if(loading){
            alert("Wait for loading to finish")
            return
        }
        if(HabitUtil.isSkippedToday(entries, h)){
            alert("Habit is skipped for today, un-skip the habit to add entries to it.")
            return
        }
        if(h.type != HabitTypeE.Normal){
            setOpen(true)
        }else{
            setLoading(true)
            if(isCompletedToday()){
                await UC.removeTodaysHabitCompletion(h.id)
            }else{
                await UC.completeHabit(h.id, 1, false)
            }
            setLoading(false)
        }
    }
    async function handleSubmit(value: number){
        await UC.completeHabit(h.id, value, false)
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
        return isCompletedToday() && isNormalHabit() && !HabitUtil.isSkippedToday(entries, h) ? "text-green-500" : "text-stone-500"
    }

    return (
        <div className='shadow-sm shadow-gray-200 dark:shadow-none bg-panel1 dark:bg-panel1 relative dark:border-border border-border border-1 rounded-2xl w-[100%] max-w-[600px] overflow-auto'>
            <div className={`flex justify-between items-center`}>
                <div className='flex items-center'>
                    <p className={`text-subtext1  p-3 pr-2 pt-3   ${settings.showDetails ? "pb-2" : ""} hover:cursor-pointer font-medium flex gap-2.5 items-center`}
                        onClick={() => {
                            UC.setCurrentHabit(h)
                            navigate("/stats")
                        }}>
                        {settings.showRanks ? 
                        "missing"
                        : h.icon} {Util.capitilizeFirst(h.name)} 
                    </p>
                    {settings.dontShowStreaks ? 
                    null :
                        <p className={`text-xs text-subtext2 flex gap-0.5 items-center ${settings.showDetails ? "mt-1" : ""}`}>
                            {UC.habitStats.get(h.id)?.streak}  {<IoFlame className=''/>}
                        </p>
                    }
                </div>
                <div className='flex gap-4 items-center'>
                    <div className='flex items-center gap-1'>
                        {!settings.showDetails && !isNormalHabit()? 
                        h.target == NO_GOAL_HABIT_TARGET ?
                         <p className='text-subtext1 dark:text-subtext2  text-[11px] '>
                                [{Util.pretifyData(`${HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}]
                        </p>  :
                        <p className='text-subtext1 dark:text-subtext2  text-[11px] '>
                                [{Util.pretifyData(`${HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}]/[{Util.pretifyData(h.target, h.type as HabitTypeE)}]
                        </p> : ""}
                        {!settings.showDetails ? 
                        <p className='text-subtext1 dark:text-subtext2  text-[9px] pb-0.5'>
                                {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                        </p>: ""}
                    </div>
                    <div className={`flex gap-3.5  ${settings.showDetails ? "absolute right-0 top-5.5" : ""}`}>
                        <button className={`h-7 flex justify-center shadow-sm shadow-gray-200 dark:shadow-none 
                            items-center rounded-lg p-2 mr-0 w-7 text-subtext1
                            text-2xl hover:cursor-pointer transition-transform hover:scale-[1.04] active:scale-[0.9]
                            ease-in-out duration-250 ${isCompletedToday() ?  HabitUtil.isSkippedToday(entries, h) ? "outline-1 outline-amber-500 dark:bg-panel2 ": "dark:bg-panel2  outline-1 outline-highlight" : HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) && !settings.dontShowRed ? "outline-red-500 outline-1 dark:bg-panel2 " : "dark:bg-panel2 outline-1 outline-border2"}`}
                            onClick={async (e) => {
                                triggerHaptic()
                                e.stopPropagation()
                                await HandleClick()
                            }}>
                            {loading ? <AiOutlineLoading className={`animate-spin ${getLoadingColor()}`}/> : 
                                        HabitUtil.isSkippedToday(entries, h) ? <TbPlayerSkipForwardFilled className='text-amber-500' size={10}/> : 
                                        isCompletedToday() ?  <FaCheck className={`dark:text-highlight text-highlight`}/> 
                                        : <FiClipboard className={`${HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) && !settings.dontShowRed ? "text-red-500" :  "text-subtext2 dark:text-subtext2" }`}/>}
                        </button>
                        <button className={`shadow-sm shadow-gray-200 dark:shadow-none h-7 flex justify-center 
                            items-center rounded-lg  mr-3 w-4 text-subtext3
                            text-2xl hover:cursor-pointer transition-all hover:scale-[1.04] active:scale-[0.9]
                            ease-in-out duration-250 outline-1 outline-border2 bg-panel2`}
                            onClick={e => {
                                e.stopPropagation()
                                setOpenSkip(true)
                            } }>
                            { <GoKebabHorizontal className={"text-subtext3 dark:text-subtext3 rotate-90" }/>}
                        </button>
                    </div>
                    <Model open={open} onClose={() => setOpen(false)}>
                        <div onClick={e => e.stopPropagation()} className='w-[90%] max-w-[400px]'>
                            <HabitLogPopUp habit={h} onExit={() => setOpen(false)} value={value} setValue={setValue}
                                onSubmit={async () => {
                                    triggerHaptic()
                                    await handleSubmit(value)
                                    alert("Success, Well Done! 🎉🎉🎉")
                                }} />
                        </div>
                    </Model>
                     <Model open={openSkip} onClose={() => setOpenSkip(false)}>
                        <SkipNotePanel habit={h} setOpenSkip={setOpenSkip}/>
                    </Model>
                </div>
            </div>
            {settings.showDetails ? 
            !isNormalHabit()?
                <div className='ml-4 mr-3 mb-3 flex mt-[-5px]  gap-2 flex-col max-w-[70%]'>
                    <div className='flex items-center gap-2 mt-1 justify-stretch overflow-scroll no-scrollbar'> 
                        {h.target == NO_GOAL_HABIT_TARGET ? null :
                        <>
                            <p className='text-subtext3 dark:text-subtext3   text-[11px]'>
                                {Math.round(HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))/Number(h.target)*100*100)/100}%
                            </p>
                            <p className='text-xs text-subtext3/40 mb-0.5'>
                                |
                            </p>
                        </>
                        }  
                        {h.target == NO_GOAL_HABIT_TARGET ? 
                        <p className='text-subtext2 dark:text-subtext3  text-[11px] whitespace-nowrap'>
                            [{Util.pretifyData(`${HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}]
                        </p>:
                        <p className='text-subtext2 dark:text-subtext3  text-[11px] whitespace-nowrap'>
                            [{Util.pretifyData(`${HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}]/[{Util.pretifyData(h.target, h.type as HabitTypeE)}]
                        </p>
                        }
                        
                         <p className='text-xs text-subtext3/40 mb-0.5'>
                            |
                        </p>
                        <p className='text-subtext2 dark:text-subtext3  text-[11px] whitespace-nowrap'>
                            {HabitUtil.getCompletionDaysString(h.completionDays)}
                        </p>
                        {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ?
                            <p className='text-xs text-subtext3/40 mb-0.5'>
                                |
                            </p>
                        : ""}
                        <p className='text-subtext2 dark:text-subtext3  text-[9px]'>
                            {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                        </p>
                    </div>
                </div>
            : 
            <div className='ml-4 mr-3 mb-3 flex items-center gap-2 '>
                <p className='text-subtext2 dark:text-subtext3  text-[11px]'>
                    {HabitUtil.getCompletionDaysString(h.completionDays)}
                </p>
                {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ?
                    <p className='text-xs text-subtext3/40 mb-0.5'>
                        |
                    </p>
                : ""}
                <p className='text-subtext2 dark:text-subtext3  text-[9px] flex items-center'>
                   {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                </p>
            </div>: ""}
            {}
        </div>
    )
}
