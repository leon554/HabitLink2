import { dateUtils } from "./dateUtils";
import { HabitTypeE, type HabitCompletionType, type HabitType } from "./types";
import { eachWeekOfInterval, add, isSameWeek} from "date-fns";
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
        if(mins < 60) return `${Math.round(mins)}m`

        return `${ Math.floor(mins/60)}h ${mins % 60}m`
    }

    export function isCompleteableToday(habit: HabitType, completions: HabitCompletionType[]|undefined){
        if(habit.completionDays.length == 1){
            if(!completions) return true
            const completionsThisWeek = getCompletionsThisWeek(completions)
            
            const completionsToday = completions.filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
            
            if(habit.weeklyTarget && completionsToday.length >= 1) return false
            if(habit.type != HabitTypeE.Normal && getCompletionDataSum(completionsToday) >= Number(habit.target)) return false
            if(habit.type == HabitTypeE.Normal && completionsToday.length >= 1) return false

            return completionsThisWeek < Number(habit.completionDays)  
        }
        
        const currentDay = (new Date()).getDay()
        const currentDayMon0 = currentDay - 1 < 0 ? 6 : currentDay - 1

        const canBeCompletedToday = habit.completionDays.charAt(currentDayMon0) == "1"

        if(!completions) return canBeCompletedToday

        if(habit.weeklyTarget || habit.type == HabitTypeE.Normal){
            return canBeCompletedToday && !hasCompletionToday(completions)
        }
        
        const completionsToday = completions.filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
        return getCompletionDataSum(completionsToday) < Number(habit.target) && canBeCompletedToday
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
        const { completionDays: wt,  creationDate: cd} = habit
        const endDate = new Date()
        const creationDate = new Date(Number(cd))
        const weeklyTarget = Number(wt)

        const weeks = eachWeekOfInterval({start: creationDate, end: endDate})
        const mostRecentWeek = weeks.length - 1

        const completionsPerWeek: number[] = []
        for(let i = 0; i < weeks.length; i++){
            let completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            let completableDaysAmt = Number(weeklyTarget)
            
            if(i == mostRecentWeek){
                completableDaysAmt = (new Date()).getDay() + 1
                if(isSameWeek(creationDate, new Date())) completableDaysAmt -= creationDate.getDay()
                completableDaysAmt = Math.min(completableDaysAmt, weeklyTarget)
            }

            if(!habit.weeklyTarget && habit.type != HabitTypeE.Normal){
                const completionAmt = getValidCompsInWeekDailyTarget(completionsThisWeek, Number(habit.target), weeks[i])
                completionsPerWeek.push(Math.min(completionAmt, weeklyTarget)/completableDaysAmt)
            }else{
                completionsPerWeek.push(Math.min(completionsThisWeek.length, completableDaysAmt) / completableDaysAmt)
            }

        }    
        return Util.avgNumArr(completionsPerWeek)
    }

    function getCompRateFixedDays(habit: HabitType, completions: HabitCompletionType[]){
        const { completionDays: compDays,  creationDate: cd} = habit
        const endDate = new Date()
        const creationDate = new Date(Number(cd))

        const weeks = eachWeekOfInterval({start: creationDate, end: endDate})
        const mostRecentWeek = weeks.length - 1
        
        const completionRatesPerWeek: number[] = []
        for(let i = 0; i < weeks.length; i++){
            const completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            const compDaysIndexs = getCompDays(compDays)
            let completableDays = compDaysIndexs.length

            if(i == mostRecentWeek){
                completableDays = getCompletableDaysThisWeek(compDays) + 1
                completableDays = (isSameWeek(creationDate, new Date())) ? 
                getCompletableNumDaysCreationSameWeek(compDays, creationDate) :
                completableDays
            }


            const completionCount = compDaysIndexs.map(d => {
                if(habit.type != HabitTypeE.Normal && !habit.weeklyTarget){
                    const compSumForDay = getCompletionValueSumDay(completionsThisWeek, add(weeks[i], {days: d}))
                    return compSumForDay >= Number(habit.target)
                }
                return completionsThisWeek.some(c => (new Date(Number(c.date))).getDay() == d)
                
            }).filter(didComplete => didComplete)
            completionRatesPerWeek.push(completionCount.length/completableDays)
        }
        return Util.avgNumArr(completionRatesPerWeek)
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
    function getCompletableNumDaysCreationSameWeek(completionDays: string, creationDate: Date){
        const compDays = getCompDays(completionDays)
        const currentDay = (new Date()).getDay()
        return compDays.filter(d => d <= currentDay && d >= creationDate.getDay()).length
    }
    function getValidCompsInWeekDailyTarget(completions: HabitCompletionType[], target: number, startWeekDate: Date){
        let completionAmt = 0
        let date = new Date(startWeekDate.getTime())
        
        for(let i = 0; i < 7; i++){
            const compSum = getCompletionValueSumDay(completions, date)
            completionAmt += (compSum >= target) ? 1 : 0
            date = add(date, {days: 1})
        }
        return completionAmt
    }

}