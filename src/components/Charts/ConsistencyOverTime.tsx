import {Line, LineChart, CartesianGrid, XAxis, YAxis} from "recharts"
import {type ChartConfig,ChartContainer,ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"
export const description = "A simple area chart"




const chartConfig = {
  consistency: {
    label: "Consistency \u00A0",
    color: "var( --color-highlight)",
  },
  strength: {
    label: "Strength"
  }
} satisfies ChartConfig

export function ConsistencyOverTime() {

    const HC = useContext(UserContext)
    const data = HabitUtil.getCompRateStrengthOverTimeChartData(HC.currentHabit, HC.habitsCompletions.get(HC.currentHabit?.id ?? 0))
    

    return (
        <div className="w-full flex flex-col gap-4 items-center font-mono bg-panel1 p-7  rounded-2xl outline-1 outline-border">
            <p className="text-title mt-1 mb-2 text-lg">
                Consistency & Strength Over Time
            </p>
            <ChartContainer config={chartConfig} className="min-h-[100px] max-h-[200px] w-full">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                left: 12,
                right: 12,
                top: 5,
                bottom: 15
                }}
                className="rounded-2xl "
            >
                <CartesianGrid vertical={false} className=""/>
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={20}
                    tickFormatter={(value) => value.slice(0, 5)}
                    angle={45}
                />
                <YAxis width={20} tickLine={false} domain={[0, 100]} axisLine={false}/>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                    indicator="line" 
                    className="bg-panel2 outline-1 outline-border2 text-subtext2"/>}
                />
                <Line
                    dataKey="consistency"
                    type="step"
                    stroke="var(--color-highlight)"
                    fillOpacity={0.6}
                    dot={false}
                    strokeWidth={2}
                />
                <Line
                    dataKey="strength"
                    type="step"
                    stroke="var(--color-highlight2)"
                    fillOpacity={0.6}
                    dot={false}
                    strokeWidth={2}
                />
            </LineChart>
            </ChartContainer>
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-highlight rounded-md"></div>
                <p className="text-xs text-subtext3">
                    Consistency
                </p>
                <div className="w-3.5 h-3.5 bg-highlight2 rounded-md"></div>
                <p className="text-xs text-subtext3">
                    Strength
                </p>
            </div>
        </div>
    )
}
