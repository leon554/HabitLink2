

import { useContext} from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"
import { FaChartLine } from "react-icons/fa6";
export const description = "A simple area chart"


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




export function ConsistencyOverTime() {

    const HC = useContext(UserContext)
    const comps = HC.habitsCompletions.get(HC.currentHabit?.id ?? 0) ?? []
    const data = HabitUtil.getCompRateStrengthOverTimeChartData(HC.currentHabit, comps)
    
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
        <div className=" flex flex-col h-70 gap-4  bg-panel1 p-7  rounded-2xl outline-1 outline-border flex-1">
            <p className="text-title mt-1 mb-0 font-medium">
                Consistency & Strength Over Time
            </p>
            {comps!.length < 5 ? 
                <div className="w-full flex justify-center items-center h-full outline-1 rounded-2xl outline-border2">
                    <p className="flex items-center gap-1.5 text-subtext2 text-sm">
                        Log 5 or more entries to unlock <FaChartLine />
                    </p>
                </div>
            :
            <>
                <div className="w-full h-full min-w-0">
                    <Line options={options} data={formatedData as ChartData<"line", number[], string>} />
                </div>
                <div className="flex justify-center items-center gap-2 w-full">
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
