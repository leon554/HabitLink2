import { useState } from 'react'
import type { HabitType } from '../utils/types'
import NumericInput from './NumericInput'

interface HabitProps{
    habit: HabitType
}
export default function HabitLogCard({habit: h}: HabitProps) {
    const [value, setValue] = useState(0)

    return (
        <div className='bg-stone-800 rounded-md w-[90%] max-w-[600px] font-mono flex justify-between items-center'>
            <p className='text-stone-200 p-4 pt-4 pb-4 text-lg'>
                {h.icon} {h.name}
            </p>
            <div className='flex gap-2'>
                <NumericInput value={value} setValue={setValue} increment={1} min={0} max={200}/>
                <button className='bg-green-400 rounded-md h-[50%] p-2 mr-2 text-stone-800 hover:cursor-pointer'>
                    Complete
                </button>
            </div>
        </div>
    )
}
