import { dateUtils } from "./dateUtils";
import { HabitTypeE, type HabitCompletionType } from "./types";

export namespace CompUtil{

    export function getCompletionValueSumToday(completions: HabitCompletionType[] | undefined){
        if(!completions) return 0
        const sum = completions
            .filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
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

    export function isCompleteableToday(completionDays: string, completions: HabitCompletionType[]|undefined){
        if(completionDays.length == 1){
            if(!completions) return true
            const allreadyComps = getCompletionsThisWeek(completions)
            const compToday = completions.some(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
            if(compToday) return false
            return allreadyComps < Number(completionDays) 
        }else{
            const currentDay = (new Date()).getDay()
            const index = currentDay - 1 < 0 ? 6 : currentDay - 1
            if(!completions){
                return completionDays.charAt(index) == "1"
            }
            return completionDays.charAt(index) == "1" && !hasCompletionToday(completions)
        }
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

}