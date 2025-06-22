import FullCircleProgressBar from "../InputComponents/FullCircleProgressBar";

interface Props{
    value: number
    title: string
    text: string
    size? : number
}
export default function ProgressPanel(p: Props) {
        
    return (
        <div className="w-[90%] max-w-[600px] flex  gap-5 p-5  bg-gray-100 rounded-2xl text-gray-950 drop-shadow-sm outline-gray-700 outline-1 items-center">
            <div>
                <FullCircleProgressBar value={Math.round(p.value)} size={p.size ?? 70} fontsize={20} thickness={2}/>
            </div>
            <div className="flex flex-col justify-center mb-0.5">
                <p className="text-xl ">
                    {p.title}
                </p>
                <p className="mt-1 text-sm text-gray-700">
                    {p.text}
                </p>
            </div>
            
        </div>
    )
}
