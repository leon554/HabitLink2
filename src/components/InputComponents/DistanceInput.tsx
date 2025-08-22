
interface DistanceProps{
    setDistance: (distance: number) => void
    distance: number
    max?: number
}
export default function DistanceInput(p: DistanceProps) {
   
    return (
        <div className="shadow-sm shadow-gray-200 dark:shadow-none flex font-mono p-1 gap-2 rounded-md text-sm outline-1 outline-border2 justify-stretch">
            <div className="flex items-center  grow-1">
                <p className="text-subtext1 pl-1 pr-2 w-14 overflow-hidden truncate">
                    {p.distance}Km
                </p>
                <input
                    type="range"
                    min="0"
                    max={p.max ?  p.max: "200"}
                    value={p.distance}
                    onChange={e => p.setDistance(Number(e.target.value))}
                    className="w-full h-2 bg-progress-panel rounded-lg appearance-none cursor-pointer slider-thumb mr-1"
                />
            </div>
            
        </div>
    )
}
