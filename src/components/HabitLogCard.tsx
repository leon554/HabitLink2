import { useContext, useState } from 'react'
import { HabitTypeE, type HabitType } from '../utils/types'
import { HabitInputContext } from './InputBox/HabitInputProvider'
import { UserContext } from './UserProvider'
import { AlertContext } from './Alert/AlertProvider'
import { AiOutlineLoading } from "react-icons/ai";


interface HabitProps{
    habit: HabitType
}
export default function HabitLogCard({habit: h}: HabitProps) {
    const [loading, setLoading] = useState(false)

    const HIC = useContext(HabitInputContext)
    const {alert} = useContext(AlertContext)
    const UC = useContext(UserContext)

    async function HandleClick(){
        if(h.type != HabitTypeE.Normal){
            HIC.callbackRef.current = handleSubmit
            HIC.alert("", h.type as HabitTypeE, h.weeklyTarget)
        }else{
            setLoading(true)
            await UC.CompleHabit(h.id, 1)
            alert("Succes, Well Done! 🎉🎉🎉")
            setLoading(false)
        }
    }
    async function handleSubmit(value: number){
        await UC.CompleHabit(h.id, value)
    }
    return (
        <div className='bg-stone-800 rounded-md w-[100%] max-w-[600px] font-mono flex justify-between items-center'>
            <p className='text-stone-200 p-4 pt-4 pb-4 text-lg'>
                {h.icon} {h.name}
            </p>
            <div className='flex gap-2'>
                
                <button className='bg-green-400 h-11 flex justify-center items-center rounded-md p-2 pl-3 pr-3 mr-2 w-25 text-stone-800 hover:cursor-pointer'
                    onClick={HandleClick}>
                    {h.type == "Normal"  ? loading ? <AiOutlineLoading className="animate-spin" /> : "Complete" : "Log"}
                </button>
            </div>
        </div>
    )
}
