import { useContext } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import { UserContext } from "../Providers/UserProvider";
import { HabitUtil } from "../../utils/HabitUtil";
import { themeContext } from "../Providers/ThemeProvider";
import { ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"




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
        <div className="w-full h-90 flex flex-col gap-4 items-center font-mono bg-panel1 p-7 rounded-2xl outline-1 outline-border">
            <p className="text-title mt-1 mb-2 text-lg">
                Most Common Entry Days
            </p>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px] min-h-[200px] w-full"
            >
            <RadarChart data={data} className="min-h-[200px] h-200" >
                <ChartTooltip cursor={false} 
                content={<ChartTooltipContent indicator="line" className="bg-panel2 outline-1 outline-border2 text-subtext2"/>}/>
                <PolarAngleAxis dataKey="day" stroke={subtext2} tickLine={false}/>
                <PolarGrid className="text-subtext3" stroke={subtext3} />
                <Radar
                    dataKey="data"
                    fill="var(--color-highlight)"
                    fillOpacity={0.6}
                    isAnimationActive={false}
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
    )
}
