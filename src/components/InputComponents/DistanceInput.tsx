
interface DistanceProps{
    setDistance: (distance: number) => void
    distance: number
    max?: number
}
export default function DistanceInput(p: DistanceProps) {
   
    return (
        <div className="flex font-mono p-1 gap-2 rounded-md text-sm outline-1 outline-stone-500 justify-stretch">
            <div className="flex items-center  grow-1">
                <p className="text-stone-400 pl-1 pr-2 w-14 overflow-hidden">
                    {p.distance}Km
                </p>
                <input
                    type="range"
                    min="0"
                    max={p.max ?  p.max: "200"}
                    value={p.distance}
                    onChange={e => p.setDistance(Number(e.target.value))}
                    className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer slider-thumb mr-1"
                />
            </div>
            
        </div>
    )
}
