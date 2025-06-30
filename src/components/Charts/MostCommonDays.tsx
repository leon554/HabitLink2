import { useContext } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer} from 'recharts';
import { UserContext } from "../Providers/UserProvider";
import { HabitUtil } from "../../utils/HabitUtil";
import { themeContext } from "../Providers/ThemeProvider";




export default function MostCommonDays() {

    const HC = useContext(UserContext)
    const {dark} = useContext(themeContext)
    const comps = HC.habitsCompletions.get(HC.currentHabit!.id) ?? []

    const data = HabitUtil.getDaysOfWeekCompletions(comps)
 
    const subtext2 = dark ? "#a1a1a1" : "#5a5d73";    
    const subtext3 = dark ? "#444444" : "#6b7891";   

    return (
        <div className="w-full h-90 flex flex-col gap-4 items-center font-mono bg-panel1 p-7 rounded-2xl outline-1 outline-border">
            <p className="text-title mt-1 mb-2 text-lg">
                Most Common Entry Days
            </p>
            <ResponsiveContainer width="100%" height="80%">
                <RadarChart cx="50%" cy="50%" outerRadius="90%" data={data}>
                <PolarGrid stroke={subtext3} gridType="circle"/>
                <PolarAngleAxis dataKey="day" fontSize={12} color={subtext2}/>
                <Radar key={dark ? "dark" : "light"} dataKey="data" fill={`${dark ? "#00c950" : "#51a2ff"}`} fillOpacity={0.7} isAnimationActive={false}/>
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
