import { useContext } from 'react'
import ProgressBar from '../InputComponents/ProgressBar'
import { AiOutlineLoading } from 'react-icons/ai'
import { UserContext } from '../Providers/UserProvider'

interface Props{
    value: number
    title: string
}
export default function ProgressPanelBox(p: Props) {
    const HC= useContext(UserContext)

    return (
        <div className=' flex flex-col gap-2 bg-panel1 p-6  pt-6 rounded-2xl outline-1 outline-border w-full'>
            <div className='flex w-full items-center justify-between mb-1'>
                <p className='text-title font-medium'>
                    {p.title}
                </p>
                <p className='text-subtext2 font-bold flex items-center justify-center'>
                    {HC.isCalculating.current.isLoading() ? <AiOutlineLoading className='animate-spin text-sm'/> : `${Math.round(p.value)}%`}
                </p>
            </div>
            <ProgressBar current={p.value} min={0} max={100} height={11}/>
        </div>
    )
}
