import CircularProgressBar from "../InputComponents/CircularProgressBar"

interface Props{
    compRate: number
    strength: number
}
export default function ConsistencyPanel(p: Props) {
    
    return (
        <div className="bg-panel1 rounded-2xl text-title outline-1 outline-border font-mono w-full p-6 ">
            
            <div className="flex justify-evenly  gap-3 ">                
                <CircularProgressBar value={Math.round(p.compRate*100)} text="Consistency"/>
                <CircularProgressBar value={Math.round(p.strength)} text="Strength"/>
            </div>
        </div>
    )
}
