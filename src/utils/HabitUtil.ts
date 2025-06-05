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
            if(getCompletionDataSum(compsToday) >= Number(habit.target) && habit.type != HabitTypeE.Normal) return false
            if(habit.type == HabitTypeE.Normal && compsToday.length >= 1) return false

            return completionsThisWeek < Number(habit.completionDays)  
        }else{
            const currentDay = (new Date()).getDay()
            const index = currentDay - 1 < 0 ? 6 : currentDay - 1
            if(!completions){
                return habit.completionDays.charAt(index) == "1"
            }

            if(habit.weeklyTarget || habit.type == HabitTypeE.Normal){
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

        const weeks = eachWeekOfInterval({start: new Date(Number(startDate)), end: endDate})

        const compsPerWeek: number[] = []
        for(let i = 0; i < weeks.length; i++){
            const compsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            
            if(i == weeks.length - 1){
                let completableDays = (new Date()).getDay() + 1
                completableDays -= (isSameWeek(new Date(Number(startDate)), new Date())) ? new Date(Number(startDate)).getDay() : 0
               
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

        const weeks = eachWeekOfInterval({start: new Date(Number(startDate)), end: endDate})
        console.log("num completions: " + completions.length)
        const compsPerWeek: number[] = []
        for(let i = 0; i < weeks.length; i++){
            const compsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            const compWeekDays = getCompDays(compDays)

            const completionCount = compWeekDays.map(d => {
                if(habit.type != HabitTypeE.Normal){
                    const compvalue = getCompletionValueSumDay(compsThisWeek, add(weeks[i], {days: d}))
                    sub(weeks[i], {days: d})
                    return compvalue >= Number(habit.target)
                }else{
                    return compsThisWeek.some(c => (new Date(Number(c.date))).getDay() == d)
                }
            }).filter(didComplete => didComplete == true)
            console.log("COmp Length: " +  completionCount.length)
            compsPerWeek.push(completionCount.length)
        }
        const ratesPerWeek = compsPerWeek.map((c, i) => {
            if(i != compsPerWeek.length - 1){
                return c/getNumCompDays(compDays)
            }else{
                let completableDays = getCompletableDaysThisWeek(compDays) + 1
                console.log("comp days: " + completableDays)
                completableDays = (isSameWeek(new Date(Number(startDate)), new Date())) ? 
                    getCompletableDaysHabitCreationSameWeek(compDays, new Date(Number(startDate))) :
                    completableDays
                console.log(completableDays)
                console.log("completions: " + c)
                return c/completableDays
            }
        })
        return Util.avgNumArr(ratesPerWeek)
    }

    function getCompDays(completionDays: string) {
        const reorderMap = [1, 2, 3, 4, 5, 6, 0];
        return completionDays.split("")
            .map((v, i) => { return {index: reorderMap[i], value: v}})
            .filter(v => v.value == "1")
            .map(v => v.index)
    }
    function getCompletableDaysThisWeek(completionDays: string){
        const compDays = getCompDays(completionDays)
        const currentDay = (new Date()).getDay()
        return compDays.filter(d => d <= currentDay).length
    }
    function getCompletableDaysHabitCreationSameWeek(completionDays: string, creationDate: Date){
        const compDays = getCompDays(completionDays)
        const currentDay = (new Date()).getDay()
        return compDays.filter(d => d <= currentDay && d >= creationDate.getDay()).length
    }
    function getNumCompDays(completionDays: string) {
        return getCompDays(completionDays).length;
    }

}