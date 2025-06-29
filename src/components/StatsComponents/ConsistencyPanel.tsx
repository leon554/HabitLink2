import ProgressBar from "../InputComponents/ProgressBar"

interface Props{
    compRate: number
    strength: number
}
export default function ConsistencyPanel(p: Props) {
    
    return (
        <div className="bg-panel1 rounded-2xl text-title outline-1 outline-border font-mono w-full p-6 ">
            
            <div className="flex flex-col gap-4 ">    
                <div className="flex flex-col gap-1">
                    <p className="text-title">
                        Consitency
                    </p>
                    <div className="flex gap-2 items-center">
                        <div className="w-full">
                            <ProgressBar min={0} max={100} current={Math.round(p.compRate*100)}/>
                        </div>
                        <p className="text-sm text-subtext1">
                            {Math.round(p.compRate*100)}%
                        </p>
                    </div>
                </div>       
                <div className="flex flex-col gap-1">
                    <p className="text-title">
                        Strength
                    </p>
                    <div className="flex gap-2 items-center">
                        <div className="w-full">
                            <ProgressBar min={0} max={100} current={Math.round(p.strength)}/>
                        </div>
                        <p className="text-sm text-subtext1">
                            {Math.round(p.strength)}%
                        </p>
                    </div>
                </div>      
            </div>
        </div>
    )
}
