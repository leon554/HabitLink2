import TimeInput from './InputComponents/TimeInput';
import DistanceInput from './InputComponents/DistanceInput';
import AmountInput from './InputComponents/NumberInput';
import { motion, AnimatePresence } from "motion/react";
import { HabitTypeE, type HabitType } from '../utils/types';
import { AiOutlineLoading } from "react-icons/ai";
import { useState } from 'react';

interface Props{
    habit: HabitType
    value: number
    setValue: (value: number) => void
    onSubmit: () => Promise<void>
    onExit: () => void
}
export default function HabitLogPopUp(p: Props) {
    const [loading, setLoading] = useState(false)

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className=" flex flex-col items-center gap-3 z-50 rounded-2xl w-[100%] bg-panel1 dark:bg-panel1 dark:outline-1 outline-border p-8">
                <h1 className="text-lg font-semibold text-title font-mono leading-0 mb-4">Enter Data</h1>
                <div className=" w-full">
                     {p.habit.type == HabitTypeE.Time_Based ? 
                        <TimeInput setDuration={p.setValue}/> 
                        : 
                        p.habit.type == HabitTypeE.Distance_Based ? 
                        <DistanceInput distance={p.value} setDistance={p.setValue} max={Number(p.habit.target)}/>
                        :
                        <AmountInput amount={p.value} setAmount={p.setValue} max={Number(p.habit.target)}/> 
                        }
                </div>
                <div className='flex w-full gap-3'>
                    <p className='text-subtext2 font-medium text-sm items-center pt-0.5'>
                        Or
                    </p>
                    <input type='number' 
                    value={p.value == 0 ? "" : p.value}
                    onChange={e => p.setValue(Number(e.target.value))}
                    className='outline-1 rounded-lg outline-border2 w-full text-sm px-1.5 text-subtext2 appearance-none'/>
                </div>
                <div className="flex justify-stretch  w-full gap-3">
                    <button
                        className="mt-2 grow-4 bg-btn  text-btn-text outline-1 outline-border dark:outline-0 font-mono p-1 rounded-xl pl-2 pr-2 hover:cursor-pointer  flex justify-center items-center"
                        onClick={async () => {
                            setLoading(true)
                            await p.onSubmit()
                            p.onExit()
                            setLoading(false)
                        }}>
                        {loading ? <AiOutlineLoading className="animate-spin" /> : "Submit"}
                    </button>
                    <button
                        className="mt-2 grow-1 bg-btn text-btn-text font-mono outline-1 outline-border dark:outline-0 p-1 rounded-xl pl-2 pr-2 hover:cursor-pointer "
                        onClick={() => {
                            p.onExit()
                        }}>
                        Exit
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
