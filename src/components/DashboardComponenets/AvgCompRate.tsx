import { useContext} from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"
import { Util } from "@/utils/util"
import { FaChartLine } from "react-icons/fa"

import {Line} from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, type ChartData} from "chart.js"


ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip,  
)

export default function AvgCompRate() {

    const HC = useContext(UserContext)
    const rawData = Util.fetchAllMapItems(HC.habitStats).map(i => i.chartData)
    const data = HabitUtil.avgSameLengthChartDataArrs(HabitUtil.normalizeChartDataArrays(rawData)) ?? []

    const rootStyles = getComputedStyle(document.documentElement)

    const title = rootStyles.getPropertyValue('--color-title').trim()
    const subtext2 = rootStyles.getPropertyValue('--color-subtext2').trim()
    const panel = rootStyles.getPropertyValue('--color-panel1').trim() 
    const border = rootStyles.getPropertyValue('--color-border').trim()

    const formatedData = {
        labels: data?.map(d => d.date),
        datasets: [
            {
                label: "Strength",
                data: data?.map(d => d.strength ?? 0) ?? [],
                borderColor: "hsl(144, 100%, 39%)",
                borderWidth: 2,
                stepped: 'middle', 
                tension: 0,
            },
            {
                label: "Concistency",
                data: data?.map(d => d.consistency ?? 0) ?? [],
                borderColor: "hsl(84, 100%, 41%",
                borderWidth: 2,
                stepped: 'middle', 
                tension: 0,
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
                mode: "index" as const,         
                intersect: false,   
                backgroundColor: panel,
                titleColor: title,   
                bodyColor: subtext2,     
                borderColor: border,    
                borderWidth: 1,
                padding: 10,
                titleFont: {
                    family: "'Inter', sans-serif",
                    weight: 500,
                    size: 12,
                },
                bodyFont: {
                    size: 11,
                },
                cornerRadius: 6,            
                displayColors: false   
            },
        },
        elements: {
            point: {
            radius: 0, 
            },
        },
        scales: {
            x: {
                display: false,
                ticks: {
                    display: false, 
                },
                grid: {
                    display: false,  
                    drawBorder: false
                },
            },
            y: {
                border: {
                    display: false,       
                },
                display: true,  
                ticks: {
                    display: false,  
                    maxTicksLimit: 6, 
                },
                grid: {
                    display: true, 
                    stepSzie: 20,
                    borderDash: [50, 50],
                    color: "hsl(0, 0%, 13%)",
                    drawBorder: false
                },
            },
        },
    }
    return (
        <div className="m-7 my-6 flex flex-col gap-7 overflow-clip ">
            <p className="text-title text-lg font-medium">
                Avg Consistency & Strength 
            </p>
            {data.length < 10 ? 
            <div className="h-70 border-1 border-border2 flex justify-center items-center rounded-2xl">
                <p className="text-sm p-6 max-sm:text-xs text-subtext3 flex flex-wrap text-center justify-center items-center gap-2">
                    Log your habits for {10-data.length} more days to see this graph <FaChartLine />
                </p>
            </div>
            :
            <>
                <div className="h-50 bg">
                    <Line options={options} data={formatedData as ChartData<"line", number[], string>}/>
                </div>
                <div className="flex justify-center items-center gap-2 w-full ">
                    <div className="w-3.5 h-3.5 bg-highlight2 rounded-md"></div>
                    <p className="text-xs text-subtext3">
                        Consistency
                    </p>
                    <div className="w-3.5 h-3.5 bg-highlight rounded-md"></div>
                    <p className="text-xs text-subtext3">
                        Strength
                    </p>
                </div>
            </>
            }
        </div>
    ) 
}
