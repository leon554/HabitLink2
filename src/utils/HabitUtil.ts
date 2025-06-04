import { dateUtils } from "./dateUtils";
import { HabitTypeE, type HabitCompletionType, type HabitType } from "./types";
import { eachWeekOfInterval, add, sub, isSameWeek} from "date-fns";
import { Util } from "./util";


export namespace HabitUtil{

    export function getCompletionValueSumToday(completions: HabitCompletionType[] | undefined){
        if(!completions) return 0
        const sum = completions
            .filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
            .reduce((a, c) => a += Number(c.data), 0)
        return Number(sum)
    }
     export function getCompletionValueSumDay(completions: HabitCompletionType[] | undefined, date: Date){
        if(!completions) return 0
        const sum = completions
            .filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), date))
            .reduce((a, c) => a += Number(c.data), 0)
        return Number(sum)
    }
    
    export function getCompletionValueSumWeek(completions: HabitCompletionType[] | undefined){
        if(!completions) return 0

        const sum = completions
            .filter(c => dateUtils.isDateInCurrentWeek(new Date(Number(c.date))))
            .reduce((a, c) => a += Number(c.data), 0)
        return Number(sum)
    }
    export function hasCompletionToday(completions: HabitCompletionType[]){
        if(!completions) return false
        return completions.some(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
    }
    export function getCompletionsThisWeek(completions: HabitCompletionType[]){
        if(!completions) return 0
        return completions.filter(c => dateUtils.isDateInCurrentWeek(new Date(Number(c.date)))).length
    }

    export function pretifyData(data: string, type: HabitTypeE){
        if(type == HabitTypeE.Distance_Based){
            return `${Number(data)}km`
        }
        if(type == HabitTypeE.Time_Based){
            return secondsToString(Number(data))
        }
        return Number(data)
    }

    function secondsToString(time: number){
        let mins = time/60
        if(mins < 60){
            return `${Math.round(mins)}m`
        }

        const hours = Math.floor(mins/60)
        mins = mins % 60

        return `${hours}h ${mins}m`
    }

    export function isCompleteableToday(habit: HabitType, completions: HabitCompletionType[]|undefined){
        if(habit.completionDays.length == 1){
            if(!completions) return true
            const completionsThisWeek = getCompletionsThisWeek(completions)
            
            const compsToday = completions.filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
            if(compsToday.length >= 1 && habit.weeklyTarget) return false
            if(getCompletionDataSum(compsToday) >= Number(habit.target)) return false

            return completionsThisWeek < Number(habit.completionDays) 
        }else{
            const currentDay = (new Date()).getDay()
            const index = currentDay - 1 < 0 ? 6 : currentDay - 1
            if(!completions){
                return habit.completionDays.charAt(index) == "1"
            }

            if(habit.weeklyTarget){
                return habit.completionDays.charAt(index) == "1" && !hasCompletionToday(completions)
            }else{
                const compsToday = completions.filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
                return habit.completionDays.charAt(index) == "1" && getCompletionDataSum(compsToday) < Number(habit.target)
            }
        }
    }
    function getCompletionDataSum(completions: HabitCompletionType[]){
        return completions.reduce((sum, cur) => sum + cur.data, 0)
    }
    export function getCompletionDaysString(completionDays: string){
        if(completionDays.length == 1){
            return `${completionDays}x Week`
        }else{
            let output = ""
            const mappedValues = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
            completionDays.split('').forEach((c, i) => {
                if(c === "1") output += mappedValues[i] + " "
            })
            return output.trim()
        }
    }
    
    export function getCompletionRate(habit: HabitType | null, completions: HabitCompletionType[] | undefined){
        if(!habit || !completions) return 0
        if(habit.completionDays.length == 1){
            return getCompRateAnyDays(habit, completions)
        }else{
            return getCompRateFixedDays(habit, completions)
        }
    }
    function getCompRateAnyDays(habit: HabitType, completions: HabitCompletionType[]){
        const { completionDays: weeklyTarget,  creationDate: startDate} = habit
        const endDate = new Date()

        const weeks = eachWeekOfInterval({start: startDate, end: endDate})
        
        const compsPerWeek: number[] = []
        for(let i = 0; i < weeks.length; i++){
            const compsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            
            if(i == weeks.length - 1){
                let completableDays = (new Date()).getDay() + 1
                completableDays -= (isSameWeek(startDate, new Date())) ? new Date(Number(startDate)).getDay() : 0
               
                if(compsThisWeek.length < completableDays){
                    const effectiveDays = Math.min(completableDays, Number(weeklyTarget));
                    const weekCompRate = Math.min(compsThisWeek.length, effectiveDays) / effectiveDays;
                    compsPerWeek.push(weekCompRate * Number(weeklyTarget));
                    continue
                }else{
                    compsPerWeek.push(Number(weeklyTarget))
                    continue
                }
            }
            
            compsPerWeek.push(compsThisWeek.length)
        }
        const ratesPerWeek = compsPerWeek.map(c => Math.min(c, Number(weeklyTarget))/Number(weeklyTarget))
        return Util.avgNumArr(ratesPerWeek)
    }
    function getCompRateFixedDays(habit: HabitType, completions: HabitCompletionType[]){
        const { completionDays: compDays,  creationDate: startDate} = habit
        const endDate = new Date()

        const weeks = eachWeekOfInterval({start: startDate, end: endDate})

        const compsPerWeek: number[] = []
        for(const week of weeks){
            const compsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), week))
            
            const compWeekDays = getCompDays(compDays)

            const completionCount = compWeekDays.map(d => {
                const compvalue = getCompletionValueSumDay(compsThisWeek, add(week, {days: d}))
                sub(week, {days: d})
                return compvalue >= Number(habit.target)
            }).filter(didComplete => didComplete == true)
            
            compsPerWeek.push(completionCount.length)
        }
        const ratesPerWeek = compsPerWeek.map(c => c/getNumCompDays(compDays))
        return Util.avgNumArr(ratesPerWeek)
    }
    function getCompDays(completionDays: string){
        const rawDays = completionDays.split("").map((_, i) => i)
        return rawDays.map(i => i - 1 < 0 ? 6 : i - 1)
    }
    function getNumCompDays(completionDays: string){
        return completionDays.split("").filter(d => d == "1").length
    }

}