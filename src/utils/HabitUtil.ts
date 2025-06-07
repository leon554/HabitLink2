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
        if(mins < 60) return `${Math.round(mins)}m`

        return `${ Math.floor(mins/60)}h ${mins % 60}m`
    }

    export function isCompleteableToday(habit: HabitType, completions: HabitCompletionType[]|undefined){
        if(habit.completionDays.length == 1){
            if(!completions) return true
            const completionsThisWeek = getCompletionsThisWeek(completions)
            
            const completionsToday = completions.filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
        
            if(habit.type != HabitTypeE.Normal && getCompletionDataSum(completionsToday) >= Number(habit.target)) return false
            if(habit.type == HabitTypeE.Normal && completionsToday.length >= 1) return false

            return completionsThisWeek < Number(habit.completionDays)  
        }
        
        const currentDay = (new Date()).getDay()
        const currentDayMon0 = currentDay - 1 < 0 ? 6 : currentDay - 1

        const canBeCompletedToday = habit.completionDays.charAt(currentDayMon0) == "1"

        if(!completions) return canBeCompletedToday

        if(habit.type == HabitTypeE.Normal){
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

        const completionRatesPerWeek: number[] = []
        for(let i = 0; i < weeks.length; i++){
            let completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            let completableDaysAmt = Number(weeklyTarget)
            
            if(habit.type != HabitTypeE.Normal){
                const completionAmt = getValidCompsInWeekDailyTarget(completionsThisWeek, Number(habit.target), weeks[i])
                completableDaysAmt = (i == mostRecentWeek) ? completionAmt : completableDaysAmt
                completionRatesPerWeek.push(Math.min(completionAmt, weeklyTarget)/completableDaysAmt)
            }else{
                completableDaysAmt = (i == mostRecentWeek) ? completionsThisWeek.length : completableDaysAmt
                completionRatesPerWeek.push(Math.min(completionsThisWeek.length, completableDaysAmt) / completableDaysAmt)
            }

        }    
        return Util.avgNumArr(completionRatesPerWeek)
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
                completableDays = getCompletableNumDaysThisWeek(compDays) + 1
                completableDays = (isSameWeek(creationDate, new Date())) ? 
                getCompletableNumDaysCreationSameWeek(compDays, creationDate) :
                completableDays
            }

            const completionCount = compDaysIndexs.map(d => {
                if(habit.type != HabitTypeE.Normal){
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
    function getCompletableNumDaysThisWeek(completionDays: string){
        const compDays = getCompDays(completionDays)
        const currentDay = (new Date()).getDay()
        return compDays.filter(d => d <= currentDay).length
    }
    function getCompletableDaysThisWeek(completionDays: string){
        const compDays = getCompDays(completionDays)
        const currentDay = (new Date()).getDay()
        return compDays.filter(d => d <= currentDay)
    }
    function getCompletableNumDaysCreationSameWeek(completionDays: string, creationDate: Date){
        const compDays = getCompDays(completionDays)
        const currentDay = (new Date()).getDay()
        return compDays.filter(d => d <= currentDay && d >= creationDate.getDay()).length
    }
    function getCompletableDaysCreationSameWeek(completionDays: string, creationDate: Date){
        const compDays = getCompDays(completionDays)
        const currentDay = (new Date()).getDay()
        return compDays.filter(d => d <= currentDay && d >= creationDate.getDay())
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

    export function getStrength(habit: HabitType | null, completions: HabitCompletionType[] | undefined){
        if(!completions || !habit) return 0
        if(habit.completionDays.length == 1){
            return getStrengthAnyDays(habit, completions)
        }
        return getStrengthFixedDays(habit, completions)
    }
    const maxStrengthDays = 30
    const strengthMultiplier = 100/maxStrengthDays
    function getStrengthAnyDays(habit: HabitType, completions: HabitCompletionType[]){
        const { completionDays: wt} = habit
        const endDate = new Date()
        const weeklyTarget = Number(wt)
        const weeksToReachMaxStrength = Math.ceil(maxStrengthDays/weeklyTarget)

        const weeks = eachWeekOfInterval({start: sub(endDate, {weeks: weeksToReachMaxStrength}), end: endDate})
        const mostRecentWeek = weeks.length - 1

        let strength: number = 0
        for(let i = 0; i < weeks.length; i++){
            let completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            let completableDaysAmt = weeklyTarget
            
            if(i == mostRecentWeek){
                completableDaysAmt = (new Date()).getDay() + 1
                completableDaysAmt = Math.min(completableDaysAmt, weeklyTarget)
            }

            if(habit.type != HabitTypeE.Normal){
                const completionAmt = getValidCompsInWeekDailyTarget(completionsThisWeek, Number(habit.target), weeks[i])
                strength += Math.min(completionAmt, weeklyTarget) * strengthMultiplier
            }
            else{
                strength += Math.min(completionsThisWeek.length, completableDaysAmt) * strengthMultiplier
            }

        }    
        return strength
    }
    function getStrengthFixedDays(habit: HabitType, completions: HabitCompletionType[]){
        const { completionDays: compDays} = habit
        const endDate = new Date()
        const weeksToReachMaxStrength = Math.ceil(getCompDays(compDays).length)

        const weeks = eachWeekOfInterval({start: sub(endDate, {weeks: weeksToReachMaxStrength}), end: endDate})
        const mostRecentWeek = weeks.length - 1
        
        let strength: number = 0
        for(let i = 0; i < weeks.length; i++){
            const completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            const compDaysIndexs = getCompDays(compDays)
            let completableDaysAmt = compDaysIndexs.length

            if(i == mostRecentWeek){
                completableDaysAmt = getCompletableNumDaysThisWeek(compDays) + 1
            }
 
            const completionCount = compDaysIndexs.map(d => {
                if(habit.type != HabitTypeE.Normal){
                    const compSumForDay = getCompletionValueSumDay(completionsThisWeek, add(weeks[i], {days: d}))
                    return compSumForDay >= Number(habit.target)
                }
                return completionsThisWeek.some(c => (new Date(Number(c.date))).getDay() == d)
                
            }).filter(didComplete => didComplete)


            strength += Math.min(completionCount.length, completableDaysAmt) * strengthMultiplier
        }
        return strength
    }

    export function getStreak(habit: HabitType | null, completions: HabitCompletionType[] | undefined){
        if(!habit || !completions) return 0
        if(habit.completionDays.length == 1){
            return getStreakAnyDays(habit, completions)
        }else{
            return getStreakFixedDays(habit, completions)
        }
    }

    function getStreakAnyDays(habit: HabitType, completions: HabitCompletionType[]){
        const { completionDays: wt,  creationDate: cd} = habit
        const endDate = new Date()
        const creationDate = new Date(Number(cd))
        const weeklyTarget = Number(wt)

        const weeks = eachWeekOfInterval({start: creationDate, end: endDate}).reverse()
        const mostRecentWeek = 0

        let streak: number = 0
        for(let i = 0; i < weeks.length; i++){
            let completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))

            let completionAmt = completionsThisWeek.length
            if(habit.type != HabitTypeE.Normal){
                const validCompletionAmt = getValidCompsInWeekDailyTarget(completionsThisWeek, Number(habit.target), weeks[i])
                completionAmt = validCompletionAmt
            }

            if(Math.min(completionAmt, weeklyTarget) >= weeklyTarget){
                streak += weeklyTarget 
            }else{
                return (i == mostRecentWeek) ? completionAmt : streak
            }
        }    
        return streak
    }

    function getStreakFixedDays(habit: HabitType, completions: HabitCompletionType[]){
        const { completionDays: compDays,  creationDate: cd} = habit
        const endDate = new Date()
        const creationDate = new Date(Number(cd))

        const weeks = eachWeekOfInterval({start: creationDate, end: endDate}).reverse()
        const mostRecentWeek = 0
        
        let streak: number = 0
        for(let i = 0; i < weeks.length; i++){
            const completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            let compDaysIndexs = getCompDays(compDays).reverse()

            if(i == mostRecentWeek){
                compDaysIndexs = getCompletableDaysThisWeek(compDays)
                compDaysIndexs = (isSameWeek(creationDate, new Date())) ? 
                getCompletableDaysCreationSameWeek(compDays, creationDate) :
                compDaysIndexs
            }


            for(const d of compDaysIndexs){
                if(habit.type != HabitTypeE.Normal){
                    const compSumForDay = getCompletionValueSumDay(completionsThisWeek, add(weeks[i], {days: d}))
                    if(compSumForDay >= Number(habit.target)){
                        streak++
                    }else{
                        return streak
                    }
                }else{
                    if(completionsThisWeek.some(c => (new Date(Number(c.date))).getDay() == d)){
                        streak++
                    }else{
                        return streak
                    }
                }
            }
        }
        return streak
    }
}