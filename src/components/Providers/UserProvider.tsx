import { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthProvider";
import { supabase } from "../../supabase-client";
import { AlertContext } from "../Alert/AlertProvider";
import {type ChartDataType, type GaolCompletionType, type GoalType, type HabitCompletionType, type HabitType, type IssueType, type SubmitIssueType } from "../../utils/types";
import { dateUtils } from "../../utils/dateUtils";
import { HabitUtil } from "../../utils/HabitUtil";
import { HabitTypeE } from "../../utils/types";
import { Util } from "../../utils/util";
import { GOAL_LIM_FREE, HABIT_LIM_FREE } from "../../utils/Constants";


interface UserType{
    createHabit: (name: string, description: string, completionDays:string, emoji: string, type: string, target: number) => Promise<void>
    createGoal: (name: string, description: string, type: string, startValue: number, goalValue: number, habitIds: number[], completionDate: Date, linkedHabitId: number | null) => Promise<void>
    archiveGoal: (goalId: number) => Promise<void>
    deleteGoal: (goalId: number) => Promise<void>
    updateHabitName: (newName: string, habitID: number) => Promise<void>
    deleteHabit: (habitId: number) => Promise<void>
    deleteHabitCompletion: (completionID: number, habitId: number) => Promise<void>
    compleGoal: (goalId: number) => Promise<void>
    lodgeIssue: (issue: SubmitIssueType) => Promise<void>
    deleteIssue: (issueId: number) => Promise<void>
    habits: Map<number, HabitType>
    habitsCompletions: Map<number, HabitCompletionType[]>,
    loading: boolean,
    currentHabit: HabitType | null
    currentGaol: GoalType | null
    goals: Map<number, GoalType>
    goalProgress: Map<number, number>
    issues: Map<number, IssueType>
    habitStats: Map<number, HabitStats>
    setCurrentGoal: (currentGaol: GoalType | null) => void
    setCurrentHabit: (currentHabit: HabitType | null) => void
    compleHabit: (habitId: number, value: number, date?: Date) => Promise<void>,
    removeTodaysHabitCompletion: (habitId: number) => Promise<void>
    addGoalCompletion: (value: number) => Promise<void>
    askGpt: (promt: string) => Promise<string>
    goalCompletions: Map<number, GaolCompletionType[]>
}
const initialValues: UserType = {
    createHabit: () => Promise.resolve(undefined),
    createGoal: () => Promise.resolve(undefined),
    archiveGoal: () => Promise.resolve(undefined),
    deleteGoal: () => Promise.resolve(undefined),
    updateHabitName: () => Promise.resolve(undefined),
    deleteHabit: () => Promise.resolve(undefined),
    deleteHabitCompletion: () => Promise.resolve(undefined),
    compleGoal: () => Promise.resolve(undefined),
    lodgeIssue: () => Promise.resolve(undefined),
    deleteIssue: () => Promise.resolve(undefined),
    habits: new Map<number, HabitType>(),
    goals: new Map<number, GoalType>(),
    issues: new Map<number, IssueType>(),
    habitsCompletions: new Map<number, HabitCompletionType[]>(),
    loading: false,
    currentHabit: null,
    currentGaol: null,
    goalProgress: new Map<number, number>(),
    habitStats: new Map<number, HabitStats>(),
    setCurrentGoal: () => null,
    setCurrentHabit: () => null,
    compleHabit: () => Promise.resolve(undefined),
    removeTodaysHabitCompletion: () => Promise.resolve(undefined),
    addGoalCompletion: () => Promise.resolve(undefined),
    askGpt: () => Promise.resolve(""),
    goalCompletions: new Map<number, GaolCompletionType[]>(),
}

export const UserContext = createContext<UserType>(initialValues)


interface Props {
    children: React.ReactNode;
}
export interface HabitStats{
    compRate: number
    partialComps: number
    completions: number
    missedSessions: number
    strength: number
    streak: number
    entries: number
    dataSum: number
    validComps: number
    completableDays: number
    chartData: ChartDataType[]
}
export default function UserProvider(props: Props) {
    const [loading, setLoading] = useState(false)
    const [currentHabit, setCurrentHabit] = useState<HabitType|null>(null)
    const [currentGaol, setCurrentGoal] = useState<GoalType|null>(null)
    const [habits, setHabits] = useState<Map<number, HabitType>>(new Map<number, HabitType>())
    const [goals, setGaols] = useState<Map<number, GoalType>>(new Map<number, GoalType>())
    const [goalProgress, setGoalProgress] = useState<Map<number, number>>(new Map<number, number>())
    const [issues, setIssues] = useState<Map<number, IssueType>>(new Map<number, IssueType>())

    const [habitsCompletions, setHabitsCompletions] = useState<Map<number, HabitCompletionType[]>>(new Map<number, HabitCompletionType[]>())
    const [goalCompletions, setGoalCompletions] = useState<Map<number, GaolCompletionType[]>>(new Map<number, GaolCompletionType[]>())

    const [habitStats, setHabitStats] = useState<Map<number, HabitStats>>(new Map<number, HabitStats>())

    const auth = useContext(AuthContext)
    const {alert} = useContext(AlertContext)

    useEffect(() => {
        const userid = auth.getUserId()
        if(!userid) return
        //make this properly async 
        getHabits()
        getGoals()
        getHabitsCompletions()
        getGoalsCompletions()
        getIssues()
    }, [auth.session?.user])
    useEffect(() => {
        const HabitStatsMap = new Map<number, HabitStats>()
        habits.forEach(h => {
            const currentHabitComps = habitsCompletions.get(h.id)

            const {compRate, missedSessions, validCompletions: validComps, completableDays} = HabitUtil.getCompletionRate(h, currentHabitComps)
            const strength = HabitUtil.getStrength(h, currentHabitComps, new Date())
            const streak = HabitUtil.getStreak(h, currentHabitComps)
            const {validComps: completions, partialComps} = HabitUtil.getCompletions(h, currentHabitComps)
            const entries = h ? habitsCompletions.get(Number(h.id))?.length : 0
            const dataSum = HabitUtil.getHabitDataSum(currentHabitComps, h?.type as HabitTypeE)
            const chartData = HabitUtil.getCompRateStrengthOverTimeChartData(h, currentHabitComps) as ChartDataType[]


            const data = {
                compRate, 
                missedSessions, 
                validComps, 
                completableDays,
                strength,
                streak,
                completions,
                partialComps,
                entries,
                dataSum,
                chartData
            } as HabitStats
            HabitStatsMap.set(h.id, data)
        })
        setHabitStats(HabitStatsMap)
    }, [habitsCompletions, auth.session?.user])

    useEffect(() => {
        const values: Map<number, number> = new Map<number, number>()
        goals.forEach(g => {
            let currentValue: undefined | number

            if(!g.linkedHabit){
                currentValue = goalCompletions.get(Number(g.id))?.sort((a, b) => b.date - a.date)[0].data
            }else{
                const startTime = new Date(g.created_at).getTime()
                const linkedHabitId = g.linkedHabit
                const completions = habitsCompletions.get(linkedHabitId)
                const validComps = completions?.filter(c => new Date(Number(c.date)).getTime() > startTime)
                currentValue =  validComps?.reduce((s, c) => s += c.data, 0)
            }

            currentValue = currentValue ?? g.startValue ?? 0    
            const startValue = g.startValue
            const targetValue = g.targetValue

            const progress = Util.calculateProgress(startValue, currentValue, targetValue)*100
            values.set(g.id, Math.min(progress, 100))
        })
        setGoalProgress(values)
    }, [goalCompletions])

    async function createHabit(name: string, description: string, completionDays:string, emoji: string, type: string, target: number){
        setLoading(true)

        if(Array.from(habits.values()).length >= HABIT_LIM_FREE && auth.localUser?.role == "free"){
            alert("You've reached your free plan limit. Check limits in settings page.");
            setLoading(false)
            return
        }

        const userid = auth.getUserId()

        const { error } = await supabase
            .from('habits')
            .insert([
                { name,  description, icon: emoji, type, completionDays, user_id: userid, target, creationDate: Date.now()},
            ])
        if(error){
            alert("Habit creation error: " + error.message)
            setLoading(false)
            return
        }
        await getHabits()
        alert("Succefully Added Habit")
        setLoading(false)
    }
    async function createGoal(name: string, description: string, type: string, startValue: number, goalValue: number, habitIds: number[], completionDate: Date, linkedHabitId: number| null){
        setLoading(true)

        if(Array.from(goals.values()).length >= GOAL_LIM_FREE && auth.localUser?.role == "free"){
            alert("You've reached your free plan limit. Check limits in settings page.");
            setLoading(false)
            return
        }

        const userid = auth.getUserId()
        const habitString = habitIds.join(",");

        const { error } = await supabase
            .from('goals')
            .insert([
                { name, description, type,  startValue, targetValue: goalValue, user_id:userid, habits: habitString, completionDate: completionDate.getTime(), linkedHabit: linkedHabitId},
            ])
        
        if(error){
            alert("Gaol creation error: " + error.message)
            setLoading(false)
            return
        }
        await getGoals()
        alert("Succefully Added Goal")
        setLoading(false)
    }
    async function archiveGoal(goalId: number){
        setLoading(true)

        const { error } = await supabase
            .from('goals')
            .update({ archived: true })
            .eq('id', goalId)
            .select()
        if(error){
            alert("Archive goal error: " + error.message)
            setLoading(false)
            return
        }

        setGaols(Util.updateMap(goals, goalId, {...goals.get(goalId)!, archived: true}))
        setLoading(false)
    }
    async function deleteGoal(goalId: number){
        setLoading(true)
        
        const {error: error1 } = await supabase
                    .from("GoalCompletions")
                    .delete()
                    .eq('goalId', goalId)
        const {error} = await supabase  
                    .from("goals")
                    .delete()
                    .eq("id", goalId)

        if(error1){
            alert("goal completion deltion error: " + error1.message)
            setLoading(false)
            return
        }
        if(error){
            alert("goal deltion error: " + error.message)
            setLoading(false)
            return
        }

        goals.delete(goalId)
        setGaols(goals)
        setLoading(false)
    }
    async function getGoals(){
        setLoading(true)
        const userid = auth.getUserId()

        let { data: goalData, error } = await supabase
            .from('goals')
            .select('*')
            .eq("user_id", userid)
    
        if(error){
            alert("Goal fetch error: " + error.message)
        }
        const goals = goalData as GoalType[]
        const goalMap = new Map<number, GoalType>()
        goals.forEach(h => {
            if(goalMap.has(h.id)) {alert("Duplicate Goal skipped"); return}
            goalMap.set(h.id, h)
            
        })
        setGaols(goalMap)
        setLoading(false)
    }
    async function getGoalsCompletions(){
        setLoading(true)
        const userid = auth.getUserId()

        const { data, error } = await supabase
            .from('GoalCompletions')
            .select('*')
            .eq("user_id", userid)
        if(error){
            alert("Goal completion fetch error: " + error.message)
        }
        
        const completions = data as GaolCompletionType[]
        const goalCompletionsMap = new Map<number, GaolCompletionType[]>()
        completions.forEach(g => {
            if(!goalCompletionsMap.has(g.goalId)){
                goalCompletionsMap.set(g.goalId, [])
            }
            goalCompletionsMap.get(g.goalId)!.push(g)
        })
        setGoalCompletions(goalCompletionsMap)
        setLoading(false)

    }
    async function addGoalCompletion(value: number){
        setLoading(true)
        if(!currentGaol) {alert("Goal completion error: current goal is not defined"); return }
        const userid = auth.getUserId()

        const { data, error } = await supabase
        .from('GoalCompletions')
        .insert([
            { data: value, date: new Date().getTime(), goalId: currentGaol.id , user_id: userid},
        ])
        .select()
        if(error){
            alert("Goal completion error: " + error.message)
            setLoading(false)
            return
        }
        const updatedGoalComps = Util.updateMapArray(goalCompletions, Number(currentGaol.id), data[0] as GaolCompletionType)
        setGoalCompletions(updatedGoalComps)
        setLoading(false)
        
    }
    async function getHabits(){
        setLoading(true)
        const userid = auth.getUserId()
        let { data: habitsData, error } = await supabase
            .from('habits')
            .select('*')
            .eq("user_id", userid)
        if(error){
            alert("Habit fetch error: " + error.message)
        }
        const habits = habitsData as HabitType[]
        const habitMap = new Map<number, HabitType>()
        habits.forEach(h => {
            if(habitMap.has(Number(h.id))) {alert("Duplicate habits skipped"); return}
            habitMap.set(Number(h.id), h)
            
        })
        setHabits(habitMap)
        setLoading(false)
    }
    async function getHabitsCompletions() {
        setLoading(true)
        const userid = auth.getUserId()

        let { data: habitsCompletionsData, error } = await supabase
            .from('habitCompletions')
            .select('*')
            .eq("user_id", userid)
        if(error){
            alert("Habit completion fetch error: " + error.message)
        }
        const habitCompletionsTemp = habitsCompletionsData as HabitCompletionType[]
        const habitCompletionsMap = new Map<number, HabitCompletionType[]>()
        habitCompletionsTemp.forEach(h => {
            if(!habitCompletionsMap.has(h.habitId)){
                habitCompletionsMap.set(h.habitId, [])
            }
            habitCompletionsMap.get(h.habitId)!.push(h)
        })
        setHabitsCompletions(habitCompletionsMap)
        setLoading(false)
    }
    async function removeTodaysHabitCompletion(habitId: number){
        setLoading(true)
        const completions = habitsCompletions.get(habitId)
        if(!completions) return 

        const completionsToBeDeleted = completions.filter(c => dateUtils.isDatesSameDay(new Date(Number(c.date)), new Date()))
        const idsToBeDeleted =completionsToBeDeleted.map(c => Number(c.id))

        const { error } = await supabase
            .from('habitCompletions')
            .delete()
            .in('id', idsToBeDeleted)

        if(error){
            alert("Deletion Error: " + error.message)
        }
        await getHabitsCompletions()
        setLoading(false)
    }
    async function compleHabit(habitId: number, value: number, date?: Date){
        const userid = auth.getUserId()

        setLoading(true)
        const { error } = await supabase
            .from('habitCompletions')
            .insert([
                { habitId, data: value, date: date ? date.getTime() : Date.now(), user_id: userid},
            ])
        if(error){
            alert("Habit Completion Error: " + error)
        }
        await getHabitsCompletions()
        setLoading(false)
    }
    async function updateHabitName(newName: string, habitID: number){
        if(loading) return
        setLoading(true)

        const {  error } = await supabase
            .from('habits')
            .update({ name: newName })
            .eq('id', habitID)

        if(error){
            alert("Habit name update erorr: " + error.message)
            setLoading(false)
            return
        }

        const newMap = Util.updateMap(habits, habitID, {...habits.get(habitID)!, name: newName})
        setHabits(newMap)
        setLoading(false)
    }
    async function deleteHabit(habitId: number){
        if(loading) return
        setLoading(true)

        const { error: err1 } = await supabase
            .from('habitCompletions')
            .delete()
            .eq('habitId', habitId)
        const {error: err2 } = await supabase
            .from("habits")
            .delete()
            .eq("id", habitId)

        if(err1 || err2){
            alert("Habit deletion error: " + err1?.message + err2?.message)
            setLoading(false)
            return 
        }

        habits.delete(habitId)
        setHabits(habits)
        setLoading(false)
    }
    async function deleteHabitCompletion(completionID: number, habitId: number){
        if(loading) return alert("Cant run wait for loading to finish")
        setLoading(true)

        const { error } = await supabase
            .from('habitCompletions')
            .delete()
            .eq('id', completionID)

        if(error){
            alert("Habit completion deletion error: " + error.message)
            setLoading(false)
            return
        }

        const currentArray = (habitsCompletions.get(habitId) ?? []).filter(c => c.id != completionID);
        const updatedArray = [...currentArray];
        const newMap = new Map(habitsCompletions);
        newMap.set(habitId, updatedArray);
        setHabitsCompletions(newMap)
        setLoading(false)
    }
    async function askGpt(promt: string){
        if(auth.localUser?.role != "premium") {
            alert("You need premuim for this feature")
            return
        }
        if(loading) return
        setLoading(true)

        const { data, error } = await supabase.functions.invoke('habitNameGen', {
            body: { promt: promt},
        })

        if(error){
            alert("Error: " + error.message)
            setLoading(false)
            return
        }

        setLoading(false)
        return data.text 
    }
    async function compleGoal(goalId: number){
        if(loading) return
        setLoading(true)

        const { error } = await supabase
            .from('goals')
            .update({ completed: true })
            .eq('id', goalId)

        if(error){
            alert("Setting goal to completed in DB failed: " + error.message)
        }
        setLoading(false)
    }
    async function lodgeIssue(issue: SubmitIssueType){
        setLoading(true)

        const userid = auth.getUserId()

        const { data, error } = await supabase
            .from('issues')
            .insert([
            { user_id: userid, page: issue.page, type: issue.type, description: issue.description, status: "pending", response: ""},
            ]).select()
        
        if(error){
            alert("Bug report error: " + error.message)
            setLoading(false)
            return
        }

        const issueData = (data[0] as IssueType)
        issues.set(issueData.id, issueData)
        setIssues(issues)
        setLoading(false)
    }
    async function getIssues(){
        setLoading(true)

        let { data, error } = await supabase
            .from('issues')
            .select('*')

        if(error){
            alert("Issue fetch error: " + error.message)
            setLoading(false)
            return true
        }

        const issuesMap = new Map<number, IssueType>()
        const issuesData = data as IssueType[]
        issuesData.map(i => {
            issuesMap.set(i.id, i)
        })
        setIssues(issuesMap)
        setLoading(false)
    }
    async function deleteIssue(issueId: number){
        setLoading(true)


        const { error } = await supabase
            .from('issues')
            .delete()
            .eq('id', issueId)

        if(error){
            alert("Bug deletion error: " + error.message)
            setLoading(false)
            return
        }

        issues.delete(issueId)
        setIssues(issues)
        setLoading(false)
    }
    return (
        
        <UserContext.Provider value={{
            createHabit,
            createGoal,
            updateHabitName,
            deleteHabit,
            deleteHabitCompletion,
            deleteIssue,
            habits,
            goals,
            habitsCompletions,
            loading,
            currentGaol,
            issues,
            setCurrentGoal,
            currentHabit,
            setCurrentHabit,
            compleHabit: compleHabit,
            removeTodaysHabitCompletion,
            addGoalCompletion,
            archiveGoal,
            deleteGoal,
            askGpt,
            compleGoal,
            lodgeIssue,
            goalCompletions,
            goalProgress,
            habitStats
        }}>
            {props.children}
        </UserContext.Provider>
    )
}
