import CircularProgressBar from "../InputComponents/CircularProgressBar"

interface Props{
    compRate: number
    strength: number
}
export default function ConsistencyPanel(p: Props) {
    
    return (
        <div className="bg-stone-800 rounded-md text-stone-300 font-mono w-full p-6 ">
            
            <div className="flex justify-evenly  gap-3 ">                
                <CircularProgressBar value={Math.round(p.compRate*100)} text="Consistency"/>
                <CircularProgressBar value={Math.round(p.strength)} text="Strength"/>
            </div>
        </div>
    )
}
