import { useContext, useEffect, useState, type SetStateAction} from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { FaChartLine } from "react-icons/fa"
import { Doughnut } from "react-chartjs-2"
import { TbChartDonut2 } from "react-icons/tb";
import {
    Chart as ChartJS,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    type ChartData
} from "chart.js"

ChartJS.register(ArcElement, Title, Tooltip, Legend)

interface Props {
  habitId?: number
  vertical? :boolean
}

interface TempStats {
    validComps: number,
    completions: number,
    partialComps: number,
    missedSessions: number
}
const defaultTempStats = {
    validComps: 0,
    completions: 0,
    partialComps: 0,
    missedSessions: 0
}
export default function SkipChart(p: Props) {
    const HC = useContext(UserContext)
    const [chartData, setChartData] = useState<[{name: string, data: 0}]>([{name: "", data: 0}])

    function getChartData(){
        const completions = p.habitId ? (HC.habitsCompletions.get(p.habitId) ?? []) : Util.fetchAllMapItems(HC.habitsCompletions).flat()
        const stats: TempStats = p.habitId ?  HC.habitStats.get(p.habitId) ?? defaultTempStats : Util.fetchAllMapItems(HC.habitStats).reduce(
            (s, c) => ({
                validComps: s.validComps + c.validComps,
                completions: s.completions + c.completions,
                partialComps: s.partialComps + c.partialComps,
                missedSessions: s.missedSessions + c.missedSessions,
            }),
            { validComps: 0, completions: 0, partialComps: 0, missedSessions: 0 }
        )
        return [
            {name: "Scheduled completions", data: stats?.validComps}, 
            {name: "Unscheduled Completions", data: (stats?.completions ?? 0) - (stats?.validComps ?? 0)},
            {name: "Skips", data: completions.filter(c => c.skip).length},
            {name: "Partial Completions", data: stats?.partialComps},
            {name: "Missed Days", data: stats?.missedSessions},
        ]
        
    }

    useEffect(() => {
        setChartData([...getChartData()] as SetStateAction<[{name: string, data: 0}]>)
    }, [HC.habitStats, HC.habitsCompletions])

    const rootStyles = getComputedStyle(document.documentElement)
    const titleColor = rootStyles.getPropertyValue("--color-title").trim()
    const subtext2 = rootStyles.getPropertyValue("--color-subtext2").trim()
    const panel = rootStyles.getPropertyValue("--color-panel1").trim()
    const border = rootStyles.getPropertyValue("--color-border").trim()

    const formatedData = {
        labels: chartData.map(d => d.name),
        datasets: [
        {
            label: "Amount",
            data: chartData.map(d => d.data), //hsl(140, 70%, 45%)
            backgroundColor: [
                "hsl(140, 70%, 45%)",  
                "hsl(220, 90%, 55%)",  
                "hsl(45, 90%, 55%)",   
                "hsl(15, 85%, 55%)",   
                "hsl(0, 75%, 55%)",    
            ],
            borderWidth: 1,
            borderColor: border
        }
        ]
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: panel,
                titleColor: titleColor,
                bodyColor: subtext2,
                borderWidth: 0,
                padding: 10,
                cornerRadius: 5,
                displayColors: true
            }
        },
        spacing: 0
    }


    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none p-7 py-4 h-85 flex flex-col gap-7 overflow-clip bg-panel1 rounded-2xl outline-1 outline-border">
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-3  mt-2">
                <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                    <TbChartDonut2 />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-title font-semibold leading-none pb-1">
                        Completion Distribution
                    </p>
                </div>
                </div>
                
            </div>
            {!chartData.some(d => d.data > 0) ? (
                <div className="h-55 border-1 border-border2 flex justify-center items-center rounded-2xl">
                <p className="text-sm p-6 max-sm:text-xs text-subtext3 flex flex-wrap text-center justify-center items-center gap-2">
                    Log your habit atleast once to see this chart <FaChartLine />
                </p>
                </div>
            ) : (
                <div className={`mb-3 ${p.vertical ? "flex-col items-center gap-7" : ""} flex justify-around  `}>
                    <div className="w-[50%]">
                        <Doughnut data={formatedData as ChartData<"doughnut", number[], string>} options={options} />
                    </div>
                   <div className={`${p.vertical ? "flex-wrap" : "flex-col"} flex gap-2 justify-center max-w-[90%]`}>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-[hsl(140,70%,45%)] rounded-md"></div>
                            <p className="text-xs text-subtext3">
                            Scheduled Comps
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-[hsl(220,90%,55%)] rounded-md"></div>
                            <p className="text-xs text-subtext3">
                                Unscheduled Comps
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-[hsl(45,90%,55%)] rounded-md"></div>
                            <p className="text-xs text-subtext3">
                                Skips
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-[hsl(15,85%,55%)] rounded-md"></div>
                            <p className="text-xs text-subtext3">
                                Partial Comps
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-[hsl(0,75%,55%)] rounded-md"></div>
                            <p className="text-xs text-subtext3">
                            Missed Sessions
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
