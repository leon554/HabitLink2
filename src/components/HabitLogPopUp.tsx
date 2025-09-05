import TimeInput from './InputComponents/TimeInput';
import DistanceInput from './InputComponents/DistanceInput';
import AmountInput from './InputComponents/NumberInput';
import { motion, AnimatePresence } from "motion/react";
import { HabitTypeE, type HabitType } from '../utils/types';
import { AiOutlineLoading } from "react-icons/ai";
import { useEffect, useRef, useState } from 'react';
import ButtonComp from './primatives/ButtonComp';
import { NO_GOAL_HABIT_TARGET } from '@/utils/Constants';

interface Props{
    habit: HabitType
    value: number
    setValue: (value: number) => void
    onSubmit: () => Promise<void>
    onExit: () => void
}
export default function HabitLogPopUp(p: Props) {
    const [loading, setLoading] = useState(false)
    const [min, setMin] = useState(0)
    const [hour, setHour] = useState(0)
    const block = useRef(false)

    useEffect(() => {
        if(block.current) {
            block.current = false
            return
        }
        setMin(p.value%3600/60)
        setHour(Math.floor(p.value/3600))
    }, [p.value])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className=" flex flex-col items-center gap-3 z-50 rounded-2xl w-[100%] bg-panel1 dark:bg-panel1 dark:outline-1 outline-border p-8">
                <h1 className="text-lg font-semibold text-title  leading-0 mb-6 mt-1">Enter Data</h1>
                <div className=" w-full">
                     {p.habit.type == HabitTypeE.Time_Based ? 
                        <TimeInput setDuration={p.setValue} duration={p.value}/> 
                        : 
                        p.habit.type == HabitTypeE.Distance_Based ? 
                        <DistanceInput distance={p.value} setDistance={p.setValue} max={Number(p.habit.target) == NO_GOAL_HABIT_TARGET ? 200 : Number(p.habit.target)}/>
                        :
                        <AmountInput amount={p.value} setAmount={p.setValue} max={Number(p.habit.target) == NO_GOAL_HABIT_TARGET ? 50 : Number(p.habit.target)}/> 
                        }
                </div>
                <div className='flex w-full gap-3'>
                    <p className='text-subtext2 font-medium text-sm items-center pt-0.5'>
                        Or
                    </p>
                    {p.habit.type == HabitTypeE.Time_Based ? 
                    <div className='flex gap-1.5 items-center '>
                        <input type='number' 
                        value={hour == 0 ? "" : hour}
                        onChange={e => {
                            let inputValue = Number(e.target.value)
                            if(inputValue > 24) inputValue = 24
                            block.current = true
                            setHour(inputValue)
                            p.setValue(inputValue*60*60 + min * 60)
                        }}
                        className='shadow-sm shadow-gray-200 dark:shadow-none outline-1 rounded-md outline-border2 w-full text-sm px-1.5 text-subtext2 appearance-none py-0.5'/>
                        <p className='mr-2 text-subtext2 font-medium text-sm'>
                            h
                        </p>
                        <input type='number' 
                        value={min == 0 ? "" : min}
                        onChange={e => {
                            let inputValue = Number(e.target.value)
                            if(inputValue > 59) inputValue = 59
                            block.current = true
                            setMin(inputValue)
                            p.setValue(inputValue*60 + hour * 3600)
                        }}
                        className='shadow-sm shadow-gray-200 dark:shadow-none outline-1 rounded-md outline-border2 w-full text-sm px-1.5 text-subtext2 appearance-none py-0.5'/>
                        <p className='text-subtext2 text-sm font-medium'>
                            m
                        </p>
                    </div> :
                    <input type='number' 
                    value={p.value == 0 ? "" : p.value}
                    onChange={e => {
                        let inputValue = Number(e.target.value)
                        if(inputValue > 2000) return p.setValue(2000)
                        p.setValue(inputValue)
                    }}
                    className='shadow-sm shadow-gray-200 dark:shadow-none outline-1 rounded-md outline-border2 w-full text-sm px-1.5 text-subtext2 appearance-none'/>
                    }
                </div>
                <div className="flex justify-stretch  w-full gap-3">
                    <ButtonComp
                        name={loading ? <AiOutlineLoading className="animate-spin" /> : "Submit"}
                        onSubmit={async () => {
                            setLoading(true)
                            await p.onSubmit()
                            p.onExit()
                            setLoading(false)
                        }}
                        highlight={true}
                        short={true}
                        style='w-full'
                        noAnimation={true}/>
                    <ButtonComp
                        name={"Exit"}
                        onSubmit={() => p.onExit()}
                        highlight={true}
                        short={true}
                        style='w-full'
                        noAnimation={true}/>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
