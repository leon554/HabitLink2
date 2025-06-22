import { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthProvider";
import { supabase } from "../../supabase-client";
import { AlertContext } from "../Alert/AlertProvider";
import {type GaolCompletionType, type GoalType, type HabitCompletionType, type HabitType } from "../../utils/types";
import { dateUtils } from "../../utils/dateUtils";
import { HabitUtil } from "../../utils/HabitUtil";
import { HabitTypeE } from "../../utils/types";
import { Util } from "../../utils/util";


interface UserType{
    createHabit: (name: string, description: string, completionDays:string, emoji: string, type: string, target: number) => Promise<void>
    createGoal: (name: string, description: string, type: string, startValue: number, goalValue: number, habitIds: number[], completionDate: Date, linkedHabitId: number | null) => Promise<void>
    habits: Map<number, HabitType>
    habitsCompletions: Map<number, HabitCompletionType[]>,
    loading: boolean,
    currentHabit: HabitType | null
    currentGaol: GoalType | null
    goals: Map<number, GoalType>
    habitRanks: Map<number, string>
    habitComps: Map<number, number>
    habitStrengths: Map<number, number>
    setCurrentGoal: (currentGaol: GoalType | null) => void
    setCurrentHabit: (currentHabit: HabitType | null) => void
    compleHabit: (habitId: number, value: number) => Promise<void>,
    removeTodaysHabitCompletion: (habitId: number) => Promise<void>
    addGoalCompletion: (value: number) => Promise<void>
    goalCompletions: Map<number, GaolCompletionType[]>
    currenthabitStats : {
        compRate: number
        partialComps: number
        validComps: number
        missedSessions: number
        strength: number
        streak: number
        entries: number | undefined
        dataSum: string
    }
}
const initialValues: UserType = {
    createHabit: () => Promise.resolve(undefined),
    createGoal: () => Promise.resolve(undefined),
    habits: new Map<number, HabitType>(),
    goals: new Map<number, GoalType>(),
    habitsCompletions: new Map<number, HabitCompletionType[]>(),
    loading: false,
    currentHabit: null,
    currentGaol: null,
    habitRanks: new Map<number, string>(),
    habitComps: new Map<number, number>(),
    habitStrengths: new Map<number, number>(),
    setCurrentGoal: () => null,
    setCurrentHabit: () => null,
    compleHabit: () => Promise.resolve(undefined),
    removeTodaysHabitCompletion: () => Promise.resolve(undefined),
    addGoalCompletion: () => Promise.resolve(undefined),
    goalCompletions: new Map<number, GaolCompletionType[]>(),
    currenthabitStats : {
        compRate: 0,
        partialComps: 0,
        validComps: 0,
        missedSessions: 0,
        strength: 0,
        streak: 0,
        entries: 0,
        dataSum: "",
    }
}

export const UserContext = createContext<UserType>(initialValues)

interface Props {
    children: React.ReactNode;
}
export default function UserProvider(props: Props) {
    const [loading, setLoading] = useState(false)
    const [currentHabit, setCurrentHabit] = useState<HabitType|null>(null)
    const [currentGaol, setCurrentGoal] = useState<GoalType|null>(null)
    const [habits, setHabits] = useState<Map<number, HabitType>>(new Map<number, HabitType>())
    const [goals, setGaols] = useState<Map<number, GoalType>>(new Map<number, GoalType>())
    const [habitRanks, setHabitRanks] = useState<Map<number, string>>(new Map<number, string>())
    const [habitComps, setHabitComps] = useState<Map<number, number>>(new Map<number, number>())
    const [habitStrengths, setHabitStrengths] = useState<Map<number, number>>(new Map<number, number>())

    const [habitsCompletions, setHabitsCompletions] = useState<Map<number, HabitCompletionType[]>>(new Map<number, HabitCompletionType[]>())
    const [goalCompletions, setGoalCompletions] = useState<Map<number, GaolCompletionType[]>>(new Map<number, GaolCompletionType[]>())

    const currentHabitCompletions = currentHabit ? habitsCompletions.get(Number(currentHabit?.id)) : undefined
    const {compRate, missedSessions} = HabitUtil.getCompletionRate(currentHabit, currentHabitCompletions)
    const strength = HabitUtil.getStrength(currentHabit, currentHabitCompletions)
    const streak = HabitUtil.getStreak(currentHabit, currentHabitCompletions)
    const {validComps, partialComps} = HabitUtil.getCompletions(currentHabit, currentHabitCompletions)
    const entries = currentHabit ? habitsCompletions.get(Number(currentHabit.id))?.length : 0
    const dataSum = HabitUtil.getHabitDataSumString(currentHabitCompletions, currentHabit?.type as HabitTypeE)


    const auth = useContext(AuthContext)
    const {alert} = useContext(AlertContext)

    useEffect(() => {
        const userid = auth.getUserId()
        if(!userid) return
        getHabits()
        getGoals()
        getHabitsCompletions()
        getGoalsCompletions()
    }, [auth.session?.user])

    useEffect(() => {
        habits.forEach(h => {
            const strength = HabitUtil.getStrength(h, habitsCompletions.get(h.id))
            const {compRate: Rate} = HabitUtil.getCompletionRate(h, habitsCompletions.get(h.id))

            setHabitRanks(prev => prev.set(h.id, HabitUtil.getRank(Number(strength))))
            setHabitStrengths(prev => prev.set(h.id, strength))
            setHabitComps(prev => prev.set(Number(h.id), Rate))
        })
    }, [habitsCompletions])

    async function createHabit(name: string, description: string, completionDays:string, emoji: string, type: string, target: number){
        setLoading(true)
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
            console.log("hid: " + h.id)
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
    async function compleHabit(habitId: number, value: number){
        const userid = auth.getUserId()

        setLoading(true)
        const { error } = await supabase
            .from('habitCompletions')
            .insert([
                { habitId, data: value, date: Date.now(), user_id: userid},
            ])
        if(error){
            alert("Habit Completion Error: " + error)
        }
        await getHabitsCompletions()
        setLoading(false)
    }

    return (
        <UserContext.Provider value={{
            createHabit,
            createGoal,
            habits,
            goals,
            habitsCompletions,
            loading,
            currentGaol,
            setCurrentGoal,
            currentHabit,
            setCurrentHabit,
            compleHabit: compleHabit,
            removeTodaysHabitCompletion,
            addGoalCompletion,
            goalCompletions,
            currenthabitStats: {compRate, missedSessions, streak, entries, strength,validComps, partialComps,dataSum},
            habitRanks,
            habitComps,
            habitStrengths
        }}>
            {props.children}
        </UserContext.Provider>
    )
}
