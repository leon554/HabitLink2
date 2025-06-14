import { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthProvider";
import { supabase } from "../../supabase-client";
import { AlertContext } from "../Alert/AlertProvider";
import {type GoalType, type HabitCompletionType, type HabitType } from "../../utils/types";
import { dateUtils } from "../../utils/dateUtils";
import { HabitUtil } from "../../utils/HabitUtil";
import { HabitTypeE } from "../../utils/types";


interface UserType{
    createHabit: (name: string, description: string, completionDays:string, emoji: string, type: string, target: number) => Promise<void>
    createGoal: (name: string, description: string, type: string, startValue: number, goalValue: number, habitIds: number[], completionDate: Date) => Promise<void>
    habits: Map<string, HabitType>
    habitsCompletions: Map<string, HabitCompletionType[]>,
    loading: boolean,
    currentHabit: HabitType | null
    currentGaol: GoalType | null
    goals: Map<string, GoalType>
    habitRanks: Map<string, string>
    setCurrentGoal: (currentGaol: GoalType | null) => void
    setCurrentHabit: (currentHabit: HabitType | null) => void
    compleHabit: (habitId: string, value: number) => Promise<void>,
    removeTodaysHabitCompletion: (habitId: string) => Promise<void>
    updateCurrentValueGoal: (value: number, add: boolean) => Promise<void>
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
    habits: new Map<string, HabitType>(),
    goals: new Map<string, GoalType>(),
    habitsCompletions: new Map<string, HabitCompletionType[]>(),
    loading: false,
    currentHabit: null,
    currentGaol: null,
    habitRanks: new Map<string, string>(),
    setCurrentGoal: () => null,
    setCurrentHabit: () => null,
    compleHabit: () => Promise.resolve(undefined),
    removeTodaysHabitCompletion: () => Promise.resolve(undefined),
    updateCurrentValueGoal: () => Promise.resolve(undefined),
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
    const [habits, setHabits] = useState<Map<string, HabitType>>(new Map<string, HabitType>())
    const [goals, setGaols] = useState<Map<string, GoalType>>(new Map<string, GoalType>())
    const [habitRanks, setHabitRanks] = useState<Map<string, string>>(new Map<string, string>())
    const [habitsCompletions, setHabitsCompletions] = useState<Map<string, HabitCompletionType[]>>(new Map<string, HabitCompletionType[]>())

    const currentHabitCompletions = currentHabit ? habitsCompletions.get(currentHabit?.id) : undefined
    const {compRate, missedSessions} = HabitUtil.getCompletionRate(currentHabit, currentHabitCompletions)
    const strength = HabitUtil.getStrength(currentHabit, currentHabitCompletions)
    const streak = HabitUtil.getStreak(currentHabit, currentHabitCompletions)
    const {validComps, partialComps} = HabitUtil.getCompletions(currentHabit, currentHabitCompletions)
    const entries = currentHabit ? habitsCompletions.get(currentHabit.id)?.length : 0
    const dataSum = HabitUtil.getHabitDataSumString(currentHabitCompletions, currentHabit?.type as HabitTypeE)


    const auth = useContext(AuthContext)
    const {alert} = useContext(AlertContext)

    useEffect(() => {
        const userid = auth.getUserId()
        if(!userid) return
        getHabits()
        getGoals()
        getHabitsCompletions()
    }, [auth.session?.user])

    useEffect(() => {
        habits.forEach(h => {
            const strength = HabitUtil.getStrength(h, habitsCompletions.get(h.id))
            setHabitRanks(prev => prev.set(h.id, HabitUtil.getRank(strength)))
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
    async function createGoal(name: string, description: string, type: string, startValue: number, goalValue: number, habitIds: number[], completionDate: Date){
        setLoading(true)
        const userid = auth.getUserId()
        const habitString = habitIds.join(",");

        const { error } = await supabase
            .from('goals')
            .insert([
                { name, description, type,  startValue, targetValue: goalValue, currentValue: startValue, user_id:userid, habits: habitString, completionDate: completionDate.getTime()},
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
        console.log(goalData)
        const goals = goalData as GoalType[]
        const goalMap = new Map<string, GoalType>()
        goals.forEach(h => {
            if(goalMap.has(h.id)) {alert("Duplicate Goal skipped"); return}
            goalMap.set(h.id, h)
            
        })
        setGaols(goalMap)
        setLoading(false)
    }
    async function updateCurrentValueGoal(value: number, add: boolean){
        setLoading(true)
        if(!currentGaol) {alert("Update Error: current goal is not defined"); return }

        const { data, error } = await supabase
            .from('goals')
            .update({ currentValue: `${add ? currentGaol?.currentValue + value : value}` })
            .eq('id', currentGaol.id)
            .select()

        if(error){
            alert("Update error: " + error)
            setLoading(false); return
        }
        if(goals.has(currentGaol.id)){
            const updatedGoal = { ...(data[0] as GoalType) };
            const newGoals = new Map(goals); 
            newGoals.set(currentGaol.id, updatedGoal);
            setGaols(newGoals);
            setCurrentGoal(updatedGoal)
        }
        else{alert("Goal doesnt exist")}
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
        const habitMap = new Map<string, HabitType>()
        habits.forEach(h => {
            if(habitMap.has(h.id)) {alert("Duplicate habits skipped"); return}
            habitMap.set(h.id, h)
            
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
        const habitCompletionsMap = new Map<string, HabitCompletionType[]>()
        habitCompletionsTemp.forEach(h => {
            if(!habitCompletionsMap.has(h.habitId)){
                habitCompletionsMap.set(h.habitId, [])
            }
            habitCompletionsMap.get(h.habitId)!.push(h)
        })
        setHabitsCompletions(habitCompletionsMap)
        setLoading(false)
    }
    async function removeTodaysHabitCompletion(habitId: string){
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
    async function compleHabit(habitId: string, value: number){
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
            updateCurrentValueGoal,
            currenthabitStats: {compRate, missedSessions, streak, entries, strength,validComps, partialComps,dataSum},
            habitRanks
        }}>
            {props.children}
        </UserContext.Provider>
    )
}
