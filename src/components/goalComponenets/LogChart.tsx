import { useContext} from "react"
import { UserContext } from "../Providers/UserProvider"
import { FaChartLine } from "react-icons/fa"
import { TbChartBarPopular } from "react-icons/tb";
import {Line} from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, type ChartData} from "chart.js"
import { dateUtils } from "@/utils/dateUtils"


ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip,  
)

export default function LogChart() {

    const HC = useContext(UserContext)
    const data = (HC.goalCompletions.get(HC.currentGaol ?? 0) ?? []).map(d => ({date: new Date(Number(d.date)), data: d.data})).reverse()

    const rootStyles = getComputedStyle(document.documentElement)

    const title = rootStyles.getPropertyValue('--color-title').trim()
    const subtext2 = rootStyles.getPropertyValue('--color-subtext2').trim()
    const panel = rootStyles.getPropertyValue('--color-panel1').trim() 
    const border = rootStyles.getPropertyValue('--color-chartAxis2').trim()
    const highlight = rootStyles.getPropertyValue('--color-highlight').trim()

    const formatedData = {
        labels: data?.map(d => dateUtils.formatDate(d.date)),
        datasets: [
            {
                label: "Data",
                data: data?.map(d => d.data ?? 0) ?? [],
                borderColor: highlight,
                borderWidth: 2, 
                tension: 0.1,
            },
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
                    color: border,
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
                    color: border,
                    drawBorder: false
                },
            },
        },
    }

    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none bg-panel1 rounded-2xl outline-1 outline-border p-7 py-4 pb-6 w-[90%] max-w-[600px] flex flex-col gap-6 ">
            <div className="flex items-center gap-3 mb-2 mt-2">
                <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                    <TbChartBarPopular />
                </div>
                <div className="flex flex-col gap-1">
                    <p className=" text-title font-semibold leading-none pb-1">
                        Data Logged Over Time
                    </p>
                </div>
            </div>
            {data.length < 5 ? 
            <div className="h-64 border-1 border-border2 flex justify-center items-center rounded-2xl">
                <p className="text-sm p-6 max-sm:text-xs text-subtext3 flex flex-wrap text-center justify-center items-center gap-2">
                    Log your goal {5-data.length} more time/s to see this graph <FaChartLine />
                </p>
            </div>
            :
            <>
                <div className="h-53 bg">
                    <Line options={options} data={formatedData as ChartData<"line", number[], string>}/>
                </div>
                <div className="flex justify-center items-center gap-2 w-full mt-3">
                    <div className="w-3.5 h-3.5 bg-highlight rounded-md"></div>
                    <p className="text-xs text-subtext3">
                        Data
                    </p>
                </div>
            </>
            }
        </div>
    )
}
