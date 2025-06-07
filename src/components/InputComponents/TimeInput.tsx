import { useState } from "react"

interface TimeProps{
    setDuration: (timer: number) => void
}
export default function TimeInput(p: TimeProps) {
    const [time, setTime] = useState({h:0, m:0, s:0})
    function isNumber(str: string) {
        return str.trim() !== '' && !isNaN(Number(str));
    }
    function setValue(value: string, key: string){
        if (!isNumber(value)) {
            value = "0";
        }

        const num = Number(value);
        const max = key === "h" ? 24 : 60;
        const clamped = Math.max(0, Math.min(num, max));
        
        const newTime = { ...time, [key]: clamped };
        setTime(newTime);

        const totalSeconds = (newTime.h * 3600) + (newTime.m * 60);
        p.setDuration(totalSeconds);
    }
    return (
        <div className="flex font-mono p-1 gap-2 rounded-md text-sm outline-1 outline-stone-500 justify-stretch">
            <div className="flex items-center  grow-1">
                <p className="text-stone-400 pl-1 pr-2 w-10  overflow-hidden">
                    {time.h}h
                </p>
                <input
                    type="range"
                    min="0"
                    max="24"
                    value={time.h}
                    onChange={e => setValue(e.target.value , "h")}
                    className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer slider-thumb "
                />
            </div>
            <div className="flex items-center  grow-1">
                <p className="text-stone-400 pl-1 pr-2 w-10  overflow-hidden">
                    {time.m}m
                </p>
                <input
                    type="range"
                    min="0"
                    max="60"
                    value={time.m}
                    onChange={e => setValue(e.target.value , "m")}
                    className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer slider-thumb mr-1"
                />
            </div>
            
        </div>
    )
}
