import { useContext } from "react";

import { UserContext } from "../Providers/UserProvider";
import { HabitUtil } from "../../utils/HabitUtil";
import { TbChartBarPopular } from "react-icons/tb"
import { FaChartLine } from "react-icons/fa6";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js"
import { Radar } from "react-chartjs-2"
import { Util } from "@/utils/util";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface Props{
    habitId?: number
}
export default function MostCommonDays(p: Props) {

    const HC = useContext(UserContext)
    const comps = p.habitId ? HC.habitsCompletions.get(HC.currentHabit!.id) ?? [] : Util.fetchAllMapItems(HC.habitsCompletions).flat()
    const rawData = HabitUtil.getDaysOfWeekCompletions(comps)
    const rootStyles = getComputedStyle(document.documentElement)

    const title = rootStyles.getPropertyValue('--color-title').trim()
    const subtext2 = rootStyles.getPropertyValue('--color-subtext2').trim()
    const panel = rootStyles.getPropertyValue('--color-panel1').trim() 
    const border = rootStyles.getPropertyValue('--color-border').trim()
    const highlight = rootStyles.getPropertyValue('--color-highlight').trim()
    
    const data = {
        labels: rawData.map(d => d.day),
        datasets: [
        {
            label: "Count",
            data: rawData.map(d => d.data),
            backgroundColor: "rgba(0, 255, 136, 0.2)",
            borderColor: highlight,
            borderWidth: 1,
            opacity: 1,
            pointRadius: 0,
            tension: 0.1
        },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        
        scales: {
        r: {
            min: 0,
            max: Math.max(...rawData.map(d => d.data)) + 1,
            angleLines: {
            color: "rgba(255,255,255,0.1)",
            },
            grid: {
            color: "rgba(255,255,255,0.1)",
            },
            pointLabels: {
            font: {
                size: 12,
                weight: "normal" as const,
                family: "'Inter', sans-serif",
            },
            color: "#aaa",
            },
            ticks: {
                beginAtZero: true,    
                display: false,
                maxTicksLimit: 5, 
            },
        },
        },
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
    }
    return (
        <div className="flex flex-col gap-4 pb-8 bg-panel1 p-7 py-5 rounded-2xl outline-1 outline-border flex-1 h-75">
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
            {comps.length < 5 ? 
                <div className="w-full flex justify-center items-center  outline-1 rounded-2xl outline-border2">
                    <p className="flex items-center gap-1.5 text-subtext2 text-sm">
                        Log 5 or more entries to unlock <FaChartLine />
                    </p>
                </div>
            :
                <div className=" h-full min-w-0">
                    <Radar data={data} options={options} />
                </div>
             }
        </div>
    )
}
