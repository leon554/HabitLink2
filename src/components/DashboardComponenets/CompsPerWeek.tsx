import { useContext, useEffect, useMemo, useState} from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { FaChartLine } from "react-icons/fa"
import { TbChartBarPopular } from "react-icons/tb";
import {Bar} from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, type ChartData} from "chart.js"
import { dateUtils } from "@/utils/dateUtils"
import Select from "../InputComponents/Select";


ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    BarElement, 
    Title, 
    Tooltip,  
 
)

interface Props{
    habitId?: number
}
export default function CompsPerWeek(p: Props) {
    const HC = useContext(UserContext)
    const rawData = useMemo(() => {return p.habitId ? HC.habitStats.get(p.habitId)!.compsPerWeek : Util.fetchAllMapItems(HC.habitStats).map(i => i.compsPerWeek).flat()}, [HC.habitStats, HC.currentHabit]) 
    const [formatedChartData, setFormatedChartData] = useState(new Map<string|number, number>()) 

    const [filter, setFilter] = useState(0)
    const items = [{name: "Week", id: 0}, {name: "Month", id: 1}]
    const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const [labels, setLabels] = useState<string[]>([])

    useEffect(() => {
        const temp = new Map<string|number, number>()
        rawData.forEach(d => {
            if(temp.has(filter == 0 ? dateUtils.formatDate(d.week) : d.week.getMonth())){
                const prevComps = temp.get(filter == 0 ? dateUtils.formatDate(d.week) : d.week.getMonth())!
                temp.set(filter == 0 ? dateUtils.formatDate(d.week) : d.week.getMonth(), prevComps + d.completions)
            }else{
                temp.set(filter == 0 ? dateUtils.formatDate(d.week) : d.week.getMonth(), d.completions)
            }
        })
        setLabels([...filter == 0 ? Array.from(temp.keys()).map(v => String(v).slice(0, 5)) : Array.from(temp.keys()).map(v => monthMap[Number(v)])])
        setFormatedChartData(temp)
    }, [rawData, filter, HC.currentHabit])

    const rootStyles = getComputedStyle(document.documentElement)

    const title = rootStyles.getPropertyValue('--color-title').trim()
    const subtext2 = rootStyles.getPropertyValue('--color-subtext2').trim()
    const panel = rootStyles.getPropertyValue('--color-panel1').trim() 
    const border = rootStyles.getPropertyValue('--color-border').trim()

    const formatedData = {
        labels: labels,
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
            <div className="w-full flex justify-between  items-center">
                <div className="flex items-center gap-3 mb-2 mt-2">
                    <div className="bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                        <TbChartBarPopular />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-lg text-title font-semibold leading-none pb-1">
                            Completions Per {filter == 0 ? "Week" : "Month"}
                        </p>
                    </div>
                </div>
                <Select items={items}
                    selectedItem={items[filter]} 
                    setSelectedItem={(id) => setFilter(id)}
                    style="text-xs bg-panel2 text-subtext3 px-2 py-0.5 rounded-lg border-1 border-border2 z-10"/>
            </div>
            {formatedChartData.size < 2 ? 
            <div className="h-55 border-1 border-border2 flex justify-center items-center rounded-2xl">
                <p className="text-sm p-6 max-sm:text-xs text-subtext3 flex flex-wrap text-center justify-center items-center gap-2">
                    Log your habits for {2-formatedChartData.size} more {filter == 0 ? "week/s" : "month/s"} to see this graph <FaChartLine />
                </p>
            </div>
            :
            <>
                <div className="h-47 bg">
                    <Bar options={options} data={formatedData as ChartData<"bar", number[], string>} key={filter}/>
                </div>
                
            </>
            }
        </div>
    ) 
}
