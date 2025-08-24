import { useContext, useEffect, useMemo, useState} from "react"
import { UserContext } from "../Providers/UserProvider"
import { Util } from "@/utils/util"
import { FaChartLine } from "react-icons/fa"
import { TbChartBarPopular } from "react-icons/tb";
import {Bar} from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, type ChartData} from "chart.js"
import { dateUtils } from "@/utils/dateUtils"
import Select from "../InputComponents/Select";
import { SettingsContext } from "../Providers/SettingsProvider";
import { IoInformationCircleOutline } from "react-icons/io5";
import Model from "../InputComponents/Model";
import ButtonComp from "../primatives/ButtonComp";

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
enum Filter {
    month = "Month",
    week ="Week"
}
export default function CompsPerWeek(p: Props) {
    const HC = useContext(UserContext)
    const {settings} = useContext(SettingsContext)

    const rawWeekData = useMemo(() => {
        return p.habitId ? 
            HC.habitStats.get(p.habitId)?.compsPerWeek ?? [] : 
            Util.fetchAllMapItems(HC.habitStats).map(i => i?.compsPerWeek ?? []).flat()
    }, [HC.habitStats, HC.currentHabit, settings]) 

    const rawMonthData = useMemo(() => {
        return p.habitId ? 
            HC.habitStats.get(p.habitId)?.compsPerMonth ?? [] : 
            Util.fetchAllMapItems(HC.habitStats).map(i => i?.compsPerMonth ?? []).flat()
    }, [HC.habitStats, HC.currentHabit, settings]) 

    const [formatedChartData, setFormatedChartData] = useState(new Map<string|number, number>()) 
    const [open, setOpen] = useState(false)

    const [filter, setFilter] = useState<Filter>(Filter.week)
    const items = [{name: "Week", id: 0}, {name: "Month", id: 1}]
    const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


    useEffect(() => {
        const temp = new Map<string | number, number>()
        if(filter == Filter.week){
            rawWeekData.forEach(d => {
                const week = dateUtils.formatDate(d.week).slice(0, 5)
                temp.set(week,  (temp.get(week) ?? 0) + (settings.countUnscheduledCompletions ?
                    d.allCompletions :
                    d.completions
                ))
            })
        }else{
            rawMonthData.sort((a, b) => a.month - b.month)
            rawMonthData.forEach(d => {
                const month = monthMap[d.month]
                temp.set(month,  (temp.get(month) ?? 0) + d.data)
            })
        }
        setFormatedChartData(new Map(temp))
    }, [rawWeekData, rawMonthData, filter, settings])

    const rootStyles = getComputedStyle(document.documentElement)

    const title = rootStyles.getPropertyValue('--color-title').trim()
    const subtext2 = rootStyles.getPropertyValue('--color-subtext2').trim()
    const panel = rootStyles.getPropertyValue('--color-panel1').trim() 
    const border = rootStyles.getPropertyValue('--color-border').trim()
    const chart = rootStyles.getPropertyValue('--color-chart-1').trim()

    const formatedData = {
        labels: Array.from(formatedChartData.keys()) ?? [],
        datasets: [
            {
                label: "Completions",
                data: Array.from(formatedChartData.values()) ?? [],
                backgroundColor: chart,
                borderRadius: 6,
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
        <div className="m-7 my-4 flex flex-col gap-7 overflow-clip">
            <div className="w-full flex justify-between  items-center">
                <div className="flex items-center gap-3 mb-2 mt-2">
                    <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 border-1 border-border2 text-subtext2 p-1.5 rounded-lg">
                        <TbChartBarPopular />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className=" text-title font-semibold leading-none">
                            Completions Per {filter == Filter.week ? "Week" : "Month"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Select items={items}
                        selectedItem={items[filter == Filter.month ? 1 : 0]} 
                        setSelectedItem={(id) => setFilter(id == 0 ? Filter.week : Filter.month)}
                        style="shadow-sm shadow-gray-200 dark:shadow-none text-xs bg-panel2 text-subtext3 px-2 py-0.5 rounded-lg border-1 border-border2 z-10"/>
                    <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer" onClick={() => {
                        setOpen(true)
                    }}/>
                </div>
            </div>
            {formatedChartData.size < 2 ? 
            <div className="h-55 border-1 border-border2 flex justify-center items-center rounded-2xl mt-[-9px]">
                <p className="text-sm p-6 max-sm:text-xs text-subtext3 flex flex-wrap text-center justify-center items-center gap-2">
                    Log your habits for {2-formatedChartData.size} more {filter == Filter.week ? "week/s" : "month/s"} to see this graph <FaChartLine />
                </p>
            </div>
            :
            <>
                <div className="h-55 bg">
                    <Bar options={options} data={formatedData as ChartData<"bar", number[], string>} key={filter}/>
                </div>
                
            </>
            }
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="bg-panel1 outline-1 outline-border rounded-2xl max-w-[400px] w-[90%] p-7 py-4 flex flex-col gap-3" onClick={e => e.stopPropagation()}>
                    <p className="text-lg text-title font-medium">
                        Info
                    </p>
                    <p className="text-sm text-subtext2">
                        This graph shows completions per week or per month. In the settings page, you can choose whether to count only scheduled completions or both scheduled and unscheduled completions for completions per week.
                    </p>
                    <p className="text-sm text-subtext2">
                        NOTE: Monthly completions show Scheduled and Unscheduled completions combined
                    </p>
                   <ButtonComp
                        name={"Done"}
                        highlight={true}
                        onSubmit={() => setOpen(false)}
                        noAnimation={true}
                        style="mt-2 mb-2"/>
                </div>
            </Model>
        </div>
    ) 
}
