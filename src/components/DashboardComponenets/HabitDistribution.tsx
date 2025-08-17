
import { useContext, useEffect, useState, type SetStateAction} from "react"
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
  habitId?: number
  vertical? :boolean
}


export default function HabitDistribution(p: Props) {
    const HC = useContext(UserContext)
    const [chartData, setChartData] = useState<[{name: string, data: 0}]>([{name: "", data: 0}])

    function getChartData(){
        const dataObjArr = [
            {name: "Legendary", data: 0},
            {name: "Strong", data: 0},
            {name: "Average", data: 0},
            {name: "Fragile", data: 0},
        ]
        Util.fetchAllMapItems(HC.habitStats).forEach(s => {
            
            if(s.strength >= 100 && s.compRate * 100 >= 100){
                dataObjArr[0].data++
            }
            else if(s.strength >= 90 && s.compRate * 100 >= 90){
                dataObjArr[1].data++
            }
            else if(s.strength >= 50 && s.compRate * 100 >= 50){
                dataObjArr[2].data++
            }
            else{
                dataObjArr[3].data++
            }
        })
        return dataObjArr
    }

    useEffect(() => {
        setChartData([...getChartData()] as SetStateAction<[{name: string, data: 0}]>)
    }, [HC.habitStats, HC.habitsCompletions])

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
                "hsl(270, 80%, 50%)",   // Legendary (gold)
                "hsl(140, 70%, 45%)",  // Strong (green)
                "hsl(30, 85%, 55%)",   // Average (orange)
                "hsl(0, 75%, 55%)",    // Fragile (red)
            ],
            borderWidth: 1,
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
        <div className="p-7 py-4 h-85 flex flex-col gap-7 overflow-clip bg-panel1 rounded-2xl outline-1 outline-border">
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-3  mt-2">
                <div className="bg-panel2 outline-1 outline-border2 text-subtext2 p-1.5 rounded-lg">
                    <TbChartBarPopular />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-title font-semibold leading-none pb-1">
                        Habit Distribution
                    </p>
                </div>
                </div>
                
            </div>
            {HC.habits.size < 2 ? (
                <div className="h-55 border-1 border-border2 flex justify-center items-center rounded-2xl">
                <p className="text-sm p-6 max-sm:text-xs text-subtext3 flex flex-wrap text-center justify-center items-center gap-2">
                    Create {2 - chartData.length} more habit/s to see this graph <FaChartLine />
                </p>
                </div>
            ) : (
                <div className={`mb-3 ${p.vertical ? "flex-col items-center gap-7" : ""} flex justify-around  `}>
                    <div className="w-[50%]">
                        <Doughnut data={formatedData as ChartData<"doughnut", number[], string>} options={options} />
                    </div>
                   <div className={`${p.vertical ? "flex-wrap" : "flex-col"} flex gap-2 justify-center max-w-[90%]`}>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-[hsl(270,80%,50%)] rounded-md "></div>
                            <p className="text-xs text-subtext3">
                                Legendary
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-[hsl(140,70%,45%)] rounded-md"></div>
                            <p className="text-xs text-subtext3">
                            Strong
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-[hsl(30,85%,55%)] rounded-md"></div>
                            <p className="text-xs text-subtext3">
                            Average
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-[hsl(0,75%,55%)] rounded-md"></div>
                            <p className="text-xs text-subtext3">
                            Fragile
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
