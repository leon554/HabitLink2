import { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./Session/AuthProvider";
import { supabase } from "../supabase-client";
import { AlertContext } from "./Alert/AlertProvider";
import {type HabitCompletionType, type HabitType } from "../utils/types";
import { dateUtils } from "../utils/dateUtils";


interface UserType{
    createHabit: (name: string, description: string, completionDays:string, emoji: string, type: string, weeklyTarget: boolean, target: number) => Promise<void>
    habits: Map<string, HabitType>
    habitsCompletions: Map<string, HabitCompletionType[]>,
    loading: boolean,
    currentHabit: HabitType | null
    setCurrentHabit: (currentHabit: HabitType | null) => void
    compleHabit: (habitId: string, value: number) => Promise<void>,
    removeTodaysHabitCompletion: (habitId: string) => Promise<void>
}
const initialValues: UserType = {
    createHabit: () => Promise.resolve(undefined),
    habits: new Map<string, HabitType>(),
    habitsCompletions: new Map<string, HabitCompletionType[]>(),
    loading: false,
    currentHabit: null,
    setCurrentHabit: () => null,
    compleHabit: () => Promise.resolve(undefined),
    removeTodaysHabitCompletion: () => Promise.resolve(undefined)
}

export const UserContext = createContext<UserType>(initialValues)

interface Props {
    children: React.ReactNode;
}
export default function UserProvider(props: Props) {
    const [loading, setLoading] = useState(false)
    const [currentHabit, setCurrentHabit] = useState<HabitType|null>(null)
    const [habits, setHabits] = useState<Map<string, HabitType>>(new Map<string, HabitType>())
    const [habitsCompletions, setHabitsCompletions] = useState<Map<string, HabitCompletionType[]>>(new Map<string, HabitCompletionType[]>())

    const auth = useContext(AuthContext)
    const {alert} = useContext(AlertContext)

    useEffect(() => {
        const userid = auth.getUserId()
        if(!userid) return
        getHabits()
        getHabitsCompletions()
    }, [auth.session?.user])

    async function createHabit(name: string, description: string, completionDays:string, emoji: string, type: string, weeklyTarget: boolean, target: number){
        setLoading(true)
        const userid = auth.getUserId()

        const { error } = await supabase
            .from('habits')
            .insert([
                { name,  description, icon: emoji, type, completionDays, user_id: userid, weeklyTarget, target, creationDate: new Date()},
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
            habits,
            habitsCompletions,
            loading,
            currentHabit,
            setCurrentHabit,
            compleHabit: compleHabit,
            removeTodaysHabitCompletion
        }}>
            {props.children}
        </UserContext.Provider>
    )
}
