import { useContext } from 'react'
import { HabitTypeE, type HabitType } from '../utils/types'
import { HabitInputContext } from './InputBox/HabitInputProvider'


interface HabitProps{
    habit: HabitType
}
export default function HabitLogCard({habit: h}: HabitProps) {
    
    const {alert} = useContext(HabitInputContext)
    //fix habit input context to have a call back on refactor
    function HandleClick(){
        if(h.type != HabitTypeE.Normal){
            alert("", h.type as HabitTypeE, h.weeklyTarget)
        }
    }
    return (
        <div className='bg-stone-800 rounded-md w-[90%] max-w-[600px] font-mono flex justify-between items-center'>
            <p className='text-stone-200 p-4 pt-4 pb-4 text-lg'>
                {h.icon} {h.name}
            </p>
            <div className='flex gap-2'>
                
                <button className='bg-green-400 rounded-md h-[50%] p-2 pl-3 pr-3 mr-2 w-25 text-stone-800 hover:cursor-pointer'
                    onClick={HandleClick}>
                    {h.type == "Normal"  ? "Complete" : "Log"}
                </button>
            </div>
        </div>
    )
}
