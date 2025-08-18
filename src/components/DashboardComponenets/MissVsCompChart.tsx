
import { useContext} from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { FaChartLine } from "react-icons/fa"
import { TbChartBarPopular } from "react-icons/tb";
import {Bar} from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, type ChartData} from "chart.js"
import { dateUtils } from "@/utils/dateUtils"
import { HabitUtil } from "@/utils/HabitUtil";

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    BarElement, 
    Title, 
    Tooltip,  
 
)

export default function MissVsCompChart() {
    const HC = useContext(UserContext)
    const data = (HabitUtil.GetCompletionDaysThisPeriodAllHabits(Util.fetchAllMapItems(HC.habits), HC.habitsCompletions) ?? []).firstResult.flat()
                    .sort((a ,b) => a.day.getTime() - b.day.getTime()).filter(d => d.completeAmount != 0 || d.missAmount != 0).slice(-30)

    const rootStyles = getComputedStyle(document.documentElement)

    const title = rootStyles.getPropertyValue('--color-title').trim()
    const subtext2 = rootStyles.getPropertyValue('--color-subtext2').trim()
    const panel = rootStyles.getPropertyValue('--color-panel1').trim() 
    const border = rootStyles.getPropertyValue('--color-border').trim()

    const formatedData = {
        labels: data.map(d => dateUtils.formatDate(d.day).slice(0, 5)),
        datasets: [
            {
                label: "Completions",
                data: data.map(d => d.completeAmount) ?? [],
                backgroundColor: "hsl(144, 100%, 39%)",
                borderRadius: 4,
            },
            {
                label: "Misses",
                data: data.map(d => d.missAmount) ?? [],
                backgroundColor: "hsl(0, 75%, 55%)",
                borderRadius: 4,
            }
        ],
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
                stacked: true,
                display: true, 
                ticks: {
                    display: true,
                    stepSize: 20, 
                },
                grid: {
                    display: false,
                    borderDash: [50, 50],
                    color: "hsl(0, 0%, 10%)",
                    drawBorder: false
                }
            },
            y: {
                stacked: true,
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
                    color: "hsl(0, 0%, 10%)",
                    drawBorder: false
                },
            },
        },
    }
    return (
        <div className="m-7 my-4 flex flex-col gap-7 overflow-clip">
            <div className="w-full flex justify-between  items-center">
                <div className="flex items-center gap-3 mb-2 mt-2">
                    <div className="bg-panel2 border-1 border-border2 text-subtext2 p-1.5 rounded-lg">
                        <TbChartBarPopular />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className=" text-title font-semibold leading-none">
                            Misses Vs Completions Per Day
                        </p>
                    </div>
                </div>
            </div>
            {data.length < 2 ? 
            <div className="h-55 border-1 border-border2 flex justify-center items-center rounded-2xl mt-[-9px]">
                <p className="text-sm p-6 max-sm:text-xs text-subtext3 flex flex-wrap text-center justify-center items-center gap-2">
                    Log your habits for {2-data.length} more day/s to see this graph <FaChartLine />
                </p>
            </div>
            :
            <>
                <div className="h-55 bg">
                    <Bar options={options} data={formatedData as ChartData<"bar", number[], string>}/>
                </div>
                
            </>
            }
            
        </div>
    ) 
}

