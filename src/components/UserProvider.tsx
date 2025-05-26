import { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./Session/AuthProvider";
import { supabase } from "../supabase-client";
import { AlertContext } from "./Alert/AlertProvider";
import type { HabitType } from "../utils/types";


interface UserType{
    createHabit: (name: string, description: string, completionDays:string, emoji: string, type: string, weeklyTarget: boolean, target: number) => Promise<void>
    habits: HabitType[]
    loading: boolean
}
const initialValues: UserType = {
    createHabit: () => Promise.resolve(undefined),
    habits: [],
    loading: false
}

export const UserContext = createContext<UserType>(initialValues)

interface Props {
    children: React.ReactNode;
}
export default function UserProvider(props: Props) {
    const [loading, setLoading] = useState(false)
    const [habits, setHabits] = useState<HabitType[]>([])

    const auth = useContext(AuthContext)
    const {alert} = useContext(AlertContext)

    useEffect(() => {
        const userid = auth.getUserId()
        if(!userid) return
        getHabits()
    }, [auth.session?.user])

    async function createHabit(name: string, description: string, completionDays:string, emoji: string, type: string, weeklyTarget: boolean, target: number){
        setLoading(true)
        const userid = auth.getUserId()

        const { error } = await supabase
            .from('habits')
            .insert([
                { name,  description, icon: emoji, type, completionDays, user_id: userid, weeklyTarget, target},
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
        let { data: habits, error } = await supabase
            .from('habits')
            .select('*')
            .eq("user_id", userid)
        if(error){
            alert("Habit fetch error: " + error.message)
        }
        setLoading(false)
        setHabits(habits as HabitType[])
    }
    return (
        <UserContext.Provider value={{
            createHabit,
            habits,
            loading
        }}>
            {props.children}
        </UserContext.Provider>
    )
}
