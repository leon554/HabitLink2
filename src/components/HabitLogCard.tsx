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
import ButtonComp from './primatives/ButtonComp';


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
        if(isSkippedToday()){
            alert("Habit is skipped for today, unskip the habit to add entries to it.")
            return
        }
        if(h.type != HabitTypeE.Normal){
            setOpen(true)
        }else{
            setLoading(true)
            if(isCompletedToday()){
                await UC.removeTodaysHabitCompletion(h.id)
            }else{
                await UC.compleHabit(h.id, 1, false)
            }
            setLoading(false)
        }
    }
    async function handleSkip(){
        setLoading(true)
        await UC.removeTodaysHabitCompletion(h.id)
        if(!isSkippedToday()){
            await UC.compleHabit(h.id, h.target, true)
        }
        setLoading(false)
    }
    async function handleSubmit(value: number){
        await UC.compleHabit(h.id, value, false)
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
    function isSkippedToday(){
        const completions = UC.habitsCompletions.get(h.id) ?? []
        return completions.some(c => c.skip && dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
    }
    function getLoadingColor(){
        return isCompletedToday() && isNormalHabit() && !isSkippedToday() ? "text-green-500" : "text-stone-500"
    }

    return (
        <div className='bg-panel1 dark:bg-panel1 relative dark:border-border border-border border-1 rounded-2xl w-[100%] max-w-[600px] overflow-auto'>
            <div className={`flex justify-between items-center`}>
                <p className={`text-subtext1  p-3 pt-3   ${settings.showDetails ? "pb-2" : ""} hover:cursor-pointer font-medium flex gap-2.5 items-center`}
                    onClick={() => {
                        UC.setCurrentHabit(h)
                        navigate("/stats")
                    }}>
                    {settings.showRanks ? 
                    "missing"
                    : h.icon} {Util.capitilizeFirst(h.name)} 
                </p>
                <div className='flex gap-4 items-center'>
                    <div className='flex items-center gap-1'>
                        {!settings.showDetails && !isNormalHabit()? 
                        <p className='text-subtext1 dark:text-subtext2  text-[11px] '>
                                [{Util.pretifyData(`${HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}]/[{Util.pretifyData(h.target, h.type as HabitTypeE)}]
                        </p> : ""}
                        {!settings.showDetails ? 
                        <p className='text-subtext1 dark:text-subtext2  text-[9px] pb-0.5'>
                                {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                        </p>: ""}
                    </div>
                    <div className={`flex gap-3.5  ${settings.showDetails ? "absolute right-0 top-5.5" : ""}`}>
                        <button className={`h-7 flex justify-center 
                            items-center rounded-lg p-2 mr-0 w-7 text-subtext1
                            text-2xl hover:cursor-pointer transition-transform hover:scale-[1.04] active:scale-[0.9]
                            ease-in-out duration-250 ${isCompletedToday() ?  isSkippedToday() ? "outline-1 outline-yellow-500 dark:bg-panel2 bg-yellow-200": "dark:bg-panel2 bg-highlight/40 outline-1 outline-highlight" : HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) && !settings.dontShowRed ? "outline-red-500 outline-1 dark:bg-panel2 bg-red-100" : "dark:bg-panel2 outline-1 outline-border2"}`}
                            onClick={async (e) => {
                                triggerHaptic()
                                e.stopPropagation()
                                await HandleClick()
                            }}>
                            {loading ? <AiOutlineLoading className={`animate-spin ${getLoadingColor()}`}/> : 
                                        isSkippedToday() ? <TbPlayerSkipForwardFilled className='text-yellow-500' size={10}/> : 
                                        isCompletedToday() ?  <FaCheck className={`dark:text-highlight text-highlight`}/> 
                                        : <FiClipboard className={`${HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) && !settings.dontShowRed ? "text-red-500" :  "text-subtext2 dark:text-subtext2" }`}/>}
                        </button>
                        <button className={`h-7 flex justify-center 
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
                                    alert("Succes, Well Done! 🎉🎉🎉")
                                }} />
                        </div>
                    </Model>
                     <Model open={openSkip} onClose={() => setOpenSkip(false)}>
                        <div onClick={e => e.stopPropagation()} className='w-[90%] max-w-[400px] bg-panel1 p-7 rounded-2xl outline-1 outline-border flex flex-col gap-3'>
                            <p className='text-title font-semibold'>
                                Skip Habit Today
                            </p>
                            <p className='text-subtext2 text-xs'>
                                This will skip your habit today without loosing your streak or other related stats.
                            </p>
                             <p className='text-subtext2 text-xs'>
                                Note: if you skip this habit it will remove all other entries for this habit that happend today.
                            </p>
                            <div className='flex items-center w-fullmt-2 gap-4'>
                                <ButtonComp
                                    name={<>
                                        {loading ? (
                                        <AiOutlineLoading className={`animate-spin ${getLoadingColor()} text-btn-text`} />
                                        ) : (
                                        isSkippedToday() ? "UnSkip" : "Skip"
                                        )}
                                        {!UC.loading && <TbPlayerSkipForwardFilled />}
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
                        </div>
                    </Model>
                </div>
            </div>
            {settings.showDetails ? 
            !isNormalHabit()?
                <div className='ml-4 mr-3 mb-3 flex mt-[-5px]  gap-2 flex-col max-w-[70%]'>
                    <div className='flex items-center gap-2 mt-1 justify-stretch overflow-scroll no-scrollbar'>   
                        <p className='text-subtext2 dark:text-subtext2   text-[11px]'>
                            {Math.round(HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))/Number(h.target)*100*100)/100}%
                        </p>
                        <p className='text-xs text-subtext3/40 mb-0.5'>
                            |
                        </p>
                        <p className='text-subtext2 dark:text-subtext2  text-[11px] whitespace-nowrap'>
                            [{Util.pretifyData(`${HabitUtil.getCompletionValueSumToday(UC.habitsCompletions.get(h.id))}`, h.type as HabitTypeE)}]/[{Util.pretifyData(h.target, h.type as HabitTypeE)}]
                        </p>
                         <p className='text-xs text-subtext3/40 mb-0.5'>
                            |
                        </p>
                        <p className='text-subtext2 dark:text-subtext2  text-[11px] whitespace-nowrap'>
                            {HabitUtil.getCompletionDaysString(h.completionDays)}
                        </p>
                        {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ?
                            <p className='text-xs text-subtext3/40 mb-0.5'>
                                |
                            </p>
                        : ""}
                        <p className='text-subtext2 dark:text-subtext2  text-[9px]'>
                            {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                        </p>
                    </div>
                </div>
            : 
            <div className='ml-4 mr-3 mb-3 flex items-center gap-2 '>
                <p className='text-subtext2 dark:text-subtext2  text-[11px]'>
                    {HabitUtil.getCompletionDaysString(h.completionDays)}
                </p>
                {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ?
                    <p className='text-xs text-subtext3/40 mb-0.5'>
                        |
                    </p>
                : ""}
                <p className='text-subtext2 dark:text-subtext2  text-[9px] flex items-center'>
                   {HabitUtil.isDueToday(h, UC.habitsCompletions.get(h.id)) ? <FaHourglassHalf /> : ""}
                </p>
            </div>: ""}
            {}
        </div>
    )
}
