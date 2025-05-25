import { createContext, useContext, useState } from "react"
import { AuthContext } from "./Session/AuthProvider";
import { supabase } from "../supabase-client";
import { AlertContext } from "./Alert/AlertProvider";

interface UserType{
    createHabit: (name: string, description: string, completionDays:string, emoji: string, type: string) => Promise<void>
    loading: boolean
}
const initialValues: UserType = {
    createHabit: () => Promise.resolve(undefined),
    loading: false
}

export const UserContext = createContext<UserType>(initialValues)

interface Props {
    children: React.ReactNode;
}
export default function UserProvider(props: Props) {
    const [loading, setLoading] = useState(false)
    const auth = useContext(AuthContext)
    const {alert} = useContext(AlertContext)


    async function createHabit(name: string, description: string, completionDays:string, emoji: string, type: string){
        setLoading(true)
        const userid = auth.getUserId()

        const { error } = await supabase
            .from('habits')
            .insert([
                { name,  description, icon: emoji, type, completionDays, user_id: userid},
            ])
        if(error){
            alert("Habit creation error: " + error.message)
            setLoading(false)
            return
        }
        alert("Succefully Added Habit")
        setLoading(false)
    }
    return (
        <UserContext.Provider value={{
            createHabit,
            loading
        }}>
            {props.children}
        </UserContext.Provider>
    )
}
