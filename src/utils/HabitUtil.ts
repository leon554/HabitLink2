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
    export function hasCompletionTodayNH(completions: HabitCompletionType[]){
        if(!completions) return false
        return completions.some(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
    }
    export function getCompletionsThisWeek(completions: HabitCompletionType[]){
        if(!completions) return []
        return completions.filter(c => dateUtils.isDateInCurrentWeek(new Date(Number(c.date))))
    }

    export function isCompleteableToday(habit: HabitType, completions: HabitCompletionType[]|undefined){
        if(habit.completionDays.length == 1){
            if(!completions) return true
            const completionsThisWeek = getCompletionsThisWeek(completions).length
            
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
            return canBeCompletedToday && !hasCompletionTodayNH(completions)
        }
        
        const completionsToday = completions.filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
        return getCompletionDataSum(completionsToday) < Number(habit.target) && canBeCompletedToday
    }


    export function getCompletionDataSum(completions: HabitCompletionType[] | undefined){
        if(!completions) return 0
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
        if(!habit || !completions) return {compRate: 0, missedSessions: 0}
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
        const creationWeek = 0

        const completionsComponents = {totalCompletions: 0, totalPossibleComps: 0}
        let missedSessions = hasCompletionToday(habit, completions) ? 0 : -1
        for(let i = 0; i < weeks.length; i++){
            let completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            let completableDaysAmt = Number(weeklyTarget)
            
            if(i == creationWeek){
                completableDaysAmt = 7 - creationDate.getDay()
            }

            if(habit.type != HabitTypeE.Normal){
                const completionAmt = getValidCompsInWeekDailyTarget(completionsThisWeek, Number(habit.target), weeks[i])

                completableDaysAmt = (i == mostRecentWeek) ? completionAmt : completableDaysAmt
                completableDaysAmt = Math.max(1, completableDaysAmt)

                if(completionAmt + dateUtils.daysLeftInWeek() < weeklyTarget && i == mostRecentWeek){
                    const missedDaysThisWeek = weeklyTarget - (completionAmt + dateUtils.daysLeftInWeek())
                    completableDaysAmt += missedDaysThisWeek -1
                    missedSessions += missedDaysThisWeek 
                }else{
                    missedSessions += completableDaysAmt - Math.min(completionAmt, weeklyTarget)
                }

                completionsComponents.totalCompletions += Math.min(completionAmt, weeklyTarget)
                completionsComponents.totalPossibleComps += completableDaysAmt
                
            }else{
                completableDaysAmt = (i == mostRecentWeek) ? completionsThisWeek.length : completableDaysAmt
                completableDaysAmt = Math.max(1, completableDaysAmt)

                if(completionsThisWeek.length + dateUtils.daysLeftInWeek() < weeklyTarget && i == mostRecentWeek){
                    const missedDaysThisWeek = weeklyTarget - (completionsThisWeek.length + dateUtils.daysLeftInWeek())
                    completableDaysAmt += missedDaysThisWeek - 1
                    missedSessions += missedDaysThisWeek
                }else{
                    missedSessions += completableDaysAmt - completionsThisWeek.length
                }

                completionsComponents.totalCompletions += Math.min(completionsThisWeek.length, completableDaysAmt)
                completionsComponents.totalPossibleComps += completableDaysAmt
            }

        } 
        console.log(completionsComponents.totalCompletions + "/" + completionsComponents.totalPossibleComps)   
        return {compRate: completionsComponents.totalCompletions/completionsComponents.totalPossibleComps, missedSessions}
    }

    function getCompRateFixedDays(habit: HabitType, completions: HabitCompletionType[]){
        const { completionDays: compDays,  creationDate: cd} = habit
        const endDate = new Date()
        const creationDate = new Date(Number(cd))

        const weeks = eachWeekOfInterval({start: creationDate, end: endDate})
        const mostRecentWeek = weeks.length - 1
        const creationWeek = 0
        
        const completionsComponents = {totalCompletions: 0, totalPossibleComps: 0}
        let missedSessions = hasCompletionToday(habit, completions) ? 0 : -1
        for(let i = 0; i < weeks.length; i++){
            const completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            const compDaysIndexs = getCompDays(compDays)
            let completableDays = compDaysIndexs.length
            

            if(i == mostRecentWeek){
                completableDays = getCompletableNumDaysThisWeek(compDays)
                completableDays = (isSameWeek(creationDate, new Date())) ? 
                getCompletableNumDaysCreationSameWeek(compDays, creationDate) :
                completableDays
            }
            else if(i == creationWeek){
                completableDays = getCompletableNumDaysCreationSameWeek(compDays, creationDate, false) 
            }

            const completionCount = compDaysIndexs.map(d => {
                if(habit.type != HabitTypeE.Normal){
                    const compSumForDay = getCompletionValueSumDay(completionsThisWeek, add(weeks[i], {days: d}))
                    return compSumForDay >= Number(habit.target)
                }
                return completionsThisWeek.some(c => (new Date(Number(c.date))).getDay() == d)
                
            }).filter(didComplete => didComplete)
            missedSessions += completableDays - completionCount.length

            completionsComponents.totalPossibleComps += completableDays
            completionsComponents.totalCompletions += completionCount.length
        }
        return {compRate: completionsComponents.totalCompletions/completionsComponents.totalPossibleComps, missedSessions}
    }

    function hasCompletionToday(habit: HabitType, completions: HabitCompletionType[]){
        const today = new Date()
        if(habit.type == HabitTypeE.Normal){
            return completions.some(c => dateUtils.isDatesSameDay(today, new Date(Number(c.date))))
        }else{
            const compSumToday = getCompletionValueSumToday(completions)
            return compSumToday >= Number(habit.target)
        }
    }
    function getCompDays(completionDays: string) {
        const reorderMap = [1, 2, 3, 4, 5, 6, 0];
        return completionDays.split("")
            .map((v, i) => { return {index: reorderMap[i], value: v}})
            .filter(v => v.value == "1")
            .map(v => v.index)
            .sort()
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
    function getCompletableNumDaysCreationSameWeek(completionDays: string, creationDate: Date, partialWeek: boolean = true){
        const compDays = getCompDays(completionDays)
        const currentDay = (new Date()).getDay()
        if(partialWeek){
            return compDays.filter(d => d <= currentDay && d >= creationDate.getDay()).length
        }else{
            return compDays.filter(d => d >= creationDate.getDay()).length
        }
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
        const creationWeek = weeks.length - 1

        let streak: number = 0
        for(let i = 0; i < weeks.length; i++){
            let completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))

            let completableDays = weeklyTarget
            let completionAmt = completionsThisWeek.length

            if(habit.type != HabitTypeE.Normal){
                const validCompletionAmt = getValidCompsInWeekDailyTarget(completionsThisWeek, Number(habit.target), weeks[i])
                completionAmt = validCompletionAmt
            }
            
            if(i == mostRecentWeek){
                if(completionAmt + dateUtils.daysLeftInWeek()  < weeklyTarget) return 0

                streak += completionAmt
                continue
            }
            if(i == creationWeek){
                const completableAmt = 7 - creationDate.getDay()
                return (completionAmt >= completableAmt) ? streak + completableAmt : streak
            }

            if(Math.min(completionAmt, completableDays) >= completableDays){
                streak += completableDays 
            }else{
                return streak
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
        const creationWeek = weeks.length - 1
        
        let streak: number = 0
        for(let i = 0; i < weeks.length; i++){
            const completionsThisWeek = completions.filter(c => dateUtils.isDateInWeek(new Date(Number(c.date)), weeks[i]))
            let compDaysIndexs = getCompDays(compDays).reverse()

            if(i == mostRecentWeek){
                compDaysIndexs = getCompletableDaysThisWeek(compDays)
                compDaysIndexs = (isSameWeek(creationDate, new Date())) ? 
                getCompletableDaysCreationSameWeek(compDays, creationDate) :
                compDaysIndexs
                compDaysIndexs.reverse()
            }else if(i == creationWeek){
                compDaysIndexs = compDaysIndexs.filter(d => d >= creationDate.getDay() )
            }

            for(let index = 0; index < compDaysIndexs.length; index++){
                if(habit.type != HabitTypeE.Normal){
                    let compSumForDay = getCompletionValueSumDay(completionsThisWeek, add(weeks[i], {days: compDaysIndexs[index]}))
                    if(compSumForDay >= Number(habit.target)){
                        streak++
                    }else{
                        if(index == compDaysIndexs.length-2 || compDaysIndexs.length == 1) continue
                        compSumForDay = getCompletionValueSumDay(completionsThisWeek, add(weeks[i], {days: compDaysIndexs[index + 1]}))
                        if(compSumForDay < Number(habit.target)  && index == (new Date()).getDay()) continue
                        return streak
                    }
                }else{
                    if(completionsThisWeek.some(c => (new Date(Number(c.date))).getDay() == compDaysIndexs[index])){
                        streak++
                    }else{
                        if(index == compDaysIndexs.length-2 || compDaysIndexs.length == 1) continue
                        if(completionsThisWeek.some(c => (new Date(Number(c.date))).getDay() == compDaysIndexs[index + 1])
                            && compDaysIndexs[index] == (new Date()).getDay()) continue
                        return streak
                    }
                }
            }
        }
        return streak
    }
    export function getCompletions(habit: HabitType | null, completions: HabitCompletionType[] | undefined){
        if(!habit || !completions) return {validComps: 0, partialComps: 0}
        if(habit.type == HabitTypeE.Normal){
            return {validComps: completions.length, partialComps: 0}
        }
        const dates = new Set<string>()
        completions.forEach(c => dates.add(getDate(new Date(Number(c.date)))))

        let validComps = 0
        let partialComps = 0
        dates.forEach(d => {
            const sum = getCompletionValueSumDay(completions, new Date(d))
            if(sum >= Number(habit.target)){
                validComps++
            }else{
                partialComps++
            }
        })
        return {validComps, partialComps}
    }
    function getDate(date: Date){
        return `${date.getMonth() +1}/${date.getDate()}/${date.getFullYear()}`
    }
    export function getHabitDataSumString(completions: HabitCompletionType[] | undefined, type: HabitTypeE | undefined){
        if(!type) return ""
        if(type == HabitTypeE.Time_Based){
            return Util.pretifyNumber(Util.secondsToHours(getCompletionDataSum(completions)))
        }
        return Util.pretifyNumber(getCompletionDataSum(completions))
    }

    export function getCompletionDaysThisWeek(habit: HabitType|null, completions: HabitCompletionType[]|undefined){
        const output = [{day: "s", done: false, complete: false}, {day: "m", done: false, complete: false},{day: "t", done: false, complete: false},{day: "w", done: false, complete: false},{day: "t", done: false, complete: false},{day: "f", done: false, complete: false},{day: "s", done: false}]
        if(!habit || !completions) return output
        
        const completionThisWeek = getCompletionsThisWeek(completions)

        if(habit.completionDays.length != 1){
            const compDays = getCompDays(habit.completionDays)
            compDays.forEach(d => output[d].complete = true)
                
        }

        output.forEach((o, i) => {
            if(habit.type == HabitTypeE.Normal){
                o.done = (completionThisWeek.some(c => (new Date(Number(c.date))).getDay() == i)) ? true : false
            }else{
                const compSum = getCompletionValueSumDay(completionThisWeek, add(dateUtils.getStartOfWeekDate(), {days: i}))
                o.done = (compSum >= Number(habit.target)) ? true : false
            }
        })
        return output


    }
    export function getCompletionDaysThisPeriod(habit: HabitType|null, completions: HabitCompletionType[]|undefined){
        let output = Array(113).fill(null).map(() => ({day: new Date(), done: false, complete: false, habitCreation: false})) 
        if(!habit || !completions) return []

        type compDaysType = {day: Date, done: boolean, complete: boolean, habitCreation: boolean}
        let subarrs: compDaysType[][] = [] 
        let date = dateUtils.getEndOfWeekDate()
        for(let i = 0; i < output.length; i++){
            output[i].day = date
            
            if(dateUtils.isDatesSameDay(date, new Date(Number(habit.creationDate)))) output[i].habitCreation = true
            if(habit.completionDays.length != 1 && date.getTime() >= Number(habit.creationDate) && date.getTime() < add((new Date()), {days: 1}).getTime()){
                const compDays = getCompDays(habit.completionDays)
                output[i].complete = compDays.includes(date.getDay())
            }
            
            if(habit.type == HabitTypeE.Normal){
                output[i].done = (completions.some(c => dateUtils.isDatesSameDay(date, new Date(Number(c.date))))) ? true : false
            }else{
                const compSum = getCompletionValueSumDay(completions, date)
                output[i].done = (compSum >= Number(habit.target)) ? true : false
            }
            date = sub(date, {days:1})
            if(i % 7 == 0 && i >= 7) subarrs.push(output.slice(i - 7, i)) 
        }
        return subarrs.reverse()
    }


    export function getRank(strength: number){
        if(strength <= 10){
            return `src/tiers/tier1.svg`
        }else if(strength <= 20){
            return "src/tiers/tier2.svg"
        }else if(strength <= 40){
            return "src/tiers/tier3.svg"
        }else if(strength <= 80){
            return "src/tiers/tier4.svg"
        }else{
            return "src/tiers/tier5.svg"
        }
    }
    export function reverseSubsection<T>(arr: T[], start: number, end: number) {
        const reversed = arr.slice(start, end + 1).reverse();
        arr.splice(start, end - start + 1, ...reversed);
        return arr;
    }
}