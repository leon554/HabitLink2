import {Line, LineChart, CartesianGrid, XAxis, YAxis} from "recharts"
import {type ChartConfig,ChartContainer,ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"
export const description = "A simple area chart"



const chartConfig = {
  date: {
    label: "date",
    color: "var( --color-highlight)",
  },
} satisfies ChartConfig

export function AreaChartStrength() {

    const HC = useContext(UserContext)
    const data = HabitUtil.getCompRateOverTimeChartData(HC.currentHabit, HC.habitsCompletions.get(HC.currentHabit?.id ?? 0))
    console.log(data)

    return (
        <div className="w-full flex flex-col gap-4 items-center font-mono bg-panel1 p-7  rounded-2xl outline-1 outline-border">
            <p className="text-title mt-1 mb-2 text-lg">
                Consitency Over Time
            </p>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                left: 12,
                right: 12,
                top: 5
                }}
                className="rounded-2xl "
            >
                <CartesianGrid vertical={false} className=""/>
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    angle={-45}

                />
                <YAxis width={20} tickLine={false} domain={[0, 120]} axisLine={false}/>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" className="bg-panel2 outline-1 outline-border2 text-subtext2"/>}
                />
                <Line
                dataKey="data"
                type="step"
                stroke="var(--color-highlight)"
                fillOpacity={0.6}
                dot={false}
                strokeWidth={2}
                />
            </LineChart>
            </ChartContainer>
        </div>
    )
}
