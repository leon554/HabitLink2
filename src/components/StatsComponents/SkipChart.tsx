import { useContext} from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { FaChartLine } from "react-icons/fa"
import { TbChartBarPopular } from "react-icons/tb"
import { Doughnut } from "react-chartjs-2"
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
  habitId: number
}

export default function SkipChart(p: Props) {
    const HC = useContext(UserContext)
    const chartData = getChartData()

    function getChartData(){
        const completions = p.habitId ? (HC.habitsCompletions.get(p.habitId) ?? []) : Util.fetchAllMapItems(HC.habitsCompletions).flat()
        const stats = HC.habitStats.get(p.habitId)
        return [{name: "Valid completions", data: stats?.validComps}, 
            {name: "Unscheduled Completions", data: (stats?.completions ?? 0) - (stats?.validComps ?? 0)},
            {name: "Skips", data: completions.filter(c => c.skip).length},
            {name: "Partial Completions", data: stats?.partialComps},
            {name: "Missed Days", data: stats?.missedSessions},
            ]
        
    }

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
            data: chartData.map(d => d.data),
            backgroundColor: [
                "hsl(140, 100%, 39%)",
                "hsl(160, 100%, 39%)",  
                "hsl(180, 100%, 39%)",  
                "hsl(200, 100%, 39%)",  
                "hsl(100, 100%, 39%)"   
            ],
            borderWidth: 2,
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
        <div className="m-7 my-6 flex flex-col gap-7 overflow-clip">
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-3 mb-2 mt-2">
                <div className="bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                    <TbChartBarPopular />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-title font-semibold leading-none pb-1">
                    Completion Distribution
                    </p>
                </div>
                </div>
                
            </div>
            {chartData.length < 2 ? (
                <div className="h-55 border-1 border-border2 flex justify-center items-center rounded-2xl">
                <p className="text-sm p-6 max-sm:text-xs text-subtext3 flex flex-wrap text-center justify-center items-center gap-2">
                    Log your habits for {2 - chartData.length} more to see this graph <FaChartLine />
                </p>
                </div>
            ) : (
                <div className=" mb-3 flex justify-around max-sm:flex-col max-sm:items-center max-sm:gap-7">
                    <div className="w-[50%]">
                        <Doughnut data={formatedData as ChartData<"doughnut", number[], string>} options={options} />
                    </div>
                    <div className="flex sm:flex-col gap-2 justify-center max-sm:flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 bg-[#00c742] rounded-md"></div>
                            <p className="text-xs font-medium text-subtext2">
                                Valid Completions
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 bg-[#00c785] rounded-md"></div>
                            <p className="text-xs font-medium text-subtext2">
                                Unscheduled Completions
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 bg-[#0085c7] rounded-md"></div>
                            <p className="text-xs font-medium text-subtext2">
                                Partial Completions
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 bg-[#00c7c7] rounded-md"></div>
                            <p className="text-xs font-medium text-subtext2">
                                Skips
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 bg-[#42c700] rounded-md"></div>
                            <p className="text-xs font-medium text-subtext2">
                                Missed Days
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
