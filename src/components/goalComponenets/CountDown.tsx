import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Providers/UserProvider"


export default function CountDown() {

    const HC = useContext(UserContext)
    const [timeLeft, setTimeLeft] = useState((HC.currentGaol?.completionDate ?? 0) - Date.now());

    useEffect(() => {
        const intervalID = setInterval(() => {
            setTimeLeft((HC.currentGaol?.completionDate ?? 0) - Date.now());
        }, 1000);

        return () => clearInterval(intervalID);
    }, [HC.currentGaol]);

    return (
        <div className='text-stone-300 bg-stone-800 w-[90%] max-w-[600px] p-5 py-8 flex gap-1 flex-col items-center font-mono'>
            <p className="text-stone-400">
                Time Left
            </p>
            <div className="flex items-center gap-1">
                <p className="text-3xl text-green-400">[</p>
                <p className="text-3xl mt-0.5">
                    {formatTime(timeLeft)}
                </p>
                <p className="text-3xl text-green-400">]</p>
            </div>
        </div>
    )
}
function formatTime(ms: number): string {
    if (ms <= 0) return "0d 00h 00m 00s";

    const totalSeconds = Math.floor(ms / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}
