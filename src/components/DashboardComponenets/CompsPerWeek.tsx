import { useContext, useEffect, useMemo, useState} from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { FaChartLine } from "react-icons/fa"
import { TbChartBarPopular } from "react-icons/tb";
import {Bar} from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, type ChartData} from "chart.js"
import { dateUtils } from "@/utils/dateUtils"


ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    BarElement, 
    Title, 
    Tooltip,  
 
)

export default function CompsPerWeek() {
    const HC = useContext(UserContext)
    const rawData = useMemo(() => {return Util.fetchAllMapItems(HC.habitStats).map(i => i.compsPerWeek).flat()}, [HC.habitStats]) 
    const [formatedChartData, setFormatedChartData] = useState(new Map<string, number>()) 

    useEffect(() => {
        console.log(formatedData)
        const temp = new Map<string, number>()
        rawData.forEach(d => {
            if(temp.has(dateUtils.formatDate(d.week))){
                const prevComps = temp.get(dateUtils.formatDate(d.week))!
                temp.set(dateUtils.formatDate(d.week), prevComps + d.completions)
            }else{
                temp.set(dateUtils.formatDate(d.week), d.completions)
            }
        })
        setFormatedChartData(temp)
    }, [rawData])

    const rootStyles = getComputedStyle(document.documentElement)

    const title = rootStyles.getPropertyValue('--color-title').trim()
    const subtext2 = rootStyles.getPropertyValue('--color-subtext2').trim()
    const panel = rootStyles.getPropertyValue('--color-panel1').trim() 
    const border = rootStyles.getPropertyValue('--color-border').trim()

    const formatedData = {
        labels: Array.from(formatedChartData.keys()),
        datasets: [
            {
                label: "Completions",
                data: Array.from(formatedChartData.values()) ?? [],
                backgroundColor: "hsl(144, 100%, 39%)",
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
                    display: true, 
                },
                grid: {
                    display: false, 
                    stepSzie: 20,
                    borderDash: [50, 50],
                    color: "hsl(0, 0%, 10%)",
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
                    color: "hsl(0, 0%, 10%)",
                    drawBorder: false
                },
            },
        },
    }
    return (
        <div className="m-7 my-6 flex flex-col gap-7 overflow-clip">
             <div className="flex items-center gap-4 mb-2 mt-2">
                <div className="bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                    <TbChartBarPopular />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-lg text-title font-semibold leading-none pb-1">
                        Completions Per Week
                    </p>
                    
                </div>
            </div>
            {formatedChartData.size < 10 ? 
            <div className="h-55 border-1 border-border2 flex justify-center items-center rounded-2xl">
                <p className="text-sm p-6 max-sm:text-xs text-subtext3 flex flex-wrap text-center justify-center items-center gap-2">
                    Log your habits for {10-formatedChartData.size} more days to see this graph <FaChartLine />
                </p>
            </div>
            :
            <>
                <div className="h-35 bg">
                    <Bar options={options} data={formatedData as ChartData<"bar", number[], string>}/>
                </div>
                <div className="flex justify-center items-center gap-2 w-full ">
                    <div className="w-3.5 h-3.5 bg-highlight rounded-md"></div>
                    <p className="text-xs text-subtext3">
                        Completions
                    </p>
                </div>
            </>
            }
        </div>
    ) 
}
