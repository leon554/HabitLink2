import {Line, LineChart, CartesianGrid} from "recharts"
import {type ChartConfig,ChartContainer,ChartTooltip} from "@/components/ui/chart"
import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { HabitUtil } from "@/utils/HabitUtil"
import { Util } from "@/utils/util"

export const description = "A simple area chart"

const chartConfig = {
  consistency: {
    label: "Consistency \u00A0",
    color: "var( --color-highlight)",
  },
  strength: {
    label: "Strength"
  },
  date: {
    label: "Date"
  }
} satisfies ChartConfig
export default function AvgCompRate() {

    const HC = useContext(UserContext)
    const rawData = Util.fetchAllMapItems(HC.habitStats).map(i => i.chartData)
    const data = HabitUtil.avgSameLengthChartDataArrs(HabitUtil.normalizeChartDataArrays(rawData))
    
    
    return (
        <div className="m-7 my-6 flex flex-col gap-7">
            <p className="text-title text-lg font-medium">
                Avg Consistency & Strength
            </p>
            <>
            <ChartContainer config={chartConfig} className="max-md:min-h-55 max-md:max-h-50">
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
                    
                    <ChartTooltip
                        cursor={false}
                        content={({ payload, active }) => {
                            if (!active || !payload?.length) return null;
                            const point = payload[0].payload;

                            return (
                            <div className="rounded-md bg-panel2 px-3 py-2 shadow-sm  outline-border2 text-subtext2 text-xs space-y-1">
                                <p className="text-muted">{point.date}</p>
                                {payload.map((entry, i) => (
                                <div key={i} className="flex justify-between gap-4">
                                    <span>{chartConfig[entry.dataKey as keyof typeof chartConfig]?.label}</span>
                                    <span>{entry.value.toFixed(2)}</span>
                                </div>
                                ))}
                            </div>
                            );
                        }}
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
            <div className="flex justify-center items-center gap-2 w-full ">
                <div className="w-3.5 h-3.5 bg-highlight rounded-md"></div>
                <p className="text-xs text-subtext3">
                    Consistency
                </p>
                <div className="w-3.5 h-3.5 bg-highlight2 rounded-md"></div>
                <p className="text-xs text-subtext3">
                    Strength
                </p>
            </div>
            </>
        </div>
    ) 
}
