import { useContext } from "react";

import { UserContext } from "../Providers/UserProvider";
import { HabitUtil } from "../../utils/HabitUtil";

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
import { useEffect, useState } from "react"

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)


export default function MostCommonDays() {

    const HC = useContext(UserContext)
    const comps = HC.habitsCompletions.get(HC.currentHabit!.id) ?? []

    const [chartKey, setChartKey] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setChartKey(prev => prev + 1);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        
        scales: {
        r: {
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
        <div className=" flex flex-col gap-4 h-70  bg-panel1 p-7  rounded-2xl outline-1 outline-border flex-1">
            <p className="text-title text-left mb-4 font-medium">
                Most Common Entry Days
            </p>
            {comps.length < 5 ? 
                <div className="w-full flex justify-center items-center  h-full outline-1 rounded-2xl outline-border2">
                    <p className="flex items-center gap-1.5 text-subtext2 text-sm">
                        Log 5 or more entries to unlock <FaChartLine />
                    </p>
                </div>
            :
                <div className=" h-full min-w-0 ">
                    <Radar data={data} options={options} key={chartKey}/>
                </div>
             }
        </div>
    )
}
