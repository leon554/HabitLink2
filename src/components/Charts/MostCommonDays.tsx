import { useContext } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import { UserContext } from "../Providers/UserProvider";
import { HabitUtil } from "../../utils/HabitUtil";
import { themeContext } from "../Providers/ThemeProvider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FaChartLine } from "react-icons/fa6";




export default function MostCommonDays() {

    const HC = useContext(UserContext)
    const {dark} = useContext(themeContext)
    const comps = HC.habitsCompletions.get(HC.currentHabit!.id) ?? []

    const data = HabitUtil.getDaysOfWeekCompletions(comps)
    const max = Math.max(...data.map(d => d.data))
    const subtext2 = dark ? "#a1a1a1" : "#5a5d73";    
    const subtext3 = dark ? "#444444" : "#6b7891";   

    const chartConfig = {
        data: {
            label: "Entries",
            color: "var( --color-highlight)",
        },
    }
    return (
        <div className=" flex flex-col gap-4 h-70 w-full  bg-panel1 p-7  rounded-2xl outline-1 outline-border">
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
                <div className="flex items-center h-full">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[170px] min-h-[100px] w-full"
                    >
                    <RadarChart data={data} className="min-h-[170px] " >
                        <ChartTooltip cursor={false} 
                        content={<ChartTooltipContent indicator="line" className="bg-panel2 outline-1 outline-border2 text-subtext2"/>}/>
                        <PolarAngleAxis dataKey="day" stroke={subtext2} tickLine={false} orientation="outer"/>
                        <PolarGrid className="text-subtext3" stroke={subtext3}/>
                        <Radar
                            dataKey="data"
                            fill="var(--color-highlight)"
                            fillOpacity={0.6}
                            isAnimationActive={false}
                            strokeLinejoin="round"
                        />
                        <PolarRadiusAxis 
                            domain={[0, Math.ceil(max*1.1)]} 
                            tickCount={6}
                            axisLine={false}
                            tick={false}
                        />
                    </RadarChart>
                    </ChartContainer>
                </div>
             }
        </div>
    )
}
