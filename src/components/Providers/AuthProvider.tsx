import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { AlertContext } from "../Alert/AlertProvider";
import { SignUpResponses, type UserType } from "../../utils/types";
import { useLocation, useNavigate } from "react-router-dom";


interface AuthType{
    session: Session| null | undefined
    user: User | null
    localUser: UserType | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<SignUpResponses>
    logout: () => Promise<void>
    getUserId: () => null|string
}
const initialValues: AuthType = {
    session: undefined,
    user: null,
    localUser: null,
    loading: false,
    login: async (_: string, _1: string) => {},
    signup: async (_: string, _1: string, _2: string) => Promise.resolve(SignUpResponses.SignUpError),
    logout: async() => {},
    getUserId: () => null
}

export const AuthContext = createContext<AuthType>(initialValues)

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider(props: Props) {
    const [session, setSession] = useState<null|Session|undefined>(undefined)
    const [user, setUser] = useState<null|User>(null)
    const [localUser, setLoacalUser] = useState<UserType|null>(null)
    const [loading, setLoading] = useState(false)
    const protectedPaths = ["/dashboard", "/log", "/create", "/stats", "/goals", "/creategoal", "/settings", "/help"]
    

    const {alert} = useContext(AlertContext)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const {data: authListener} = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log("Event: " + _event + ", Session: " + session)
            setSession(session)
        })

        return () => {authListener.subscription.unsubscribe()}
    }, [])
    
    useEffect(() => {
        if(session === undefined) return
        navigateUser(session)
    }, [session])

    async function navigateUser(session: Session|null){
        if(!session) {navigate("/auth"); return}
        setLoading(true)

        const { data, error} = await supabase.auth.getUser()

        if(error){
            alert("User does not exists in DB: " + error.message)
            await supabase.auth.signOut()
            navigate("/")
            setLoading(false)
            return
        }

        setUser(data.user)
        await createUserEntry(data.user)

        const currentPath = location.pathname

        if(protectedPaths.includes(currentPath)){
            navigate(currentPath)
            setLoading(false)
            return
        }
        navigate("/dashboard"); 
        setLoading(false)
    }
    
    async function createUserEntry(data: User){
        const exists = await checkIfUserEntryExists(data)
        if(exists) return

        const { error } = await supabase
            .from('users')
            .insert([
                { email: data.email, name: data.user_metadata.name, role: "free", user_id: data.id},
            ])
        if(error){
            alert("insert error: " + error.message)
            return
        }
        navigateUser(session ?? null)
    }
    async function checkIfUserEntryExists(data: User){
        let { data: user, error } = await supabase
            .from('users')
            .select()
            .eq("user_id", data.id)
        if(error){
            alert("Fetch Error: " + error.message)
        }

        if(user == null) return false
        setLoacalUser((user ?? [])[0] as UserType)
        return (user.length != 0) ? true : false
    }
    async function login(email: string, password: string){
        setLoading(true)
        const {error} = await supabase.auth.signInWithPassword({email, password})
        setLoading(false)

        if(error){
            alert("Log In Error: " + error.message)
        }else{
            
        }
    }
    async function signup(name: string, email: string, password: string) {
        setLoading(true)
        const {error, data} = await supabase.auth.signUp({email, password, options: {data: {name}}})
        setLoading(false)

        if(error){
            alert("Sign Up Error: " + error.message)
            return SignUpResponses.SignUpError
        }
        if(data.user?.identities?.length === 0){
            alert("User allready exists please log in")
            return SignUpResponses.UserExists
        }else{
            alert("Confirmation email sent")
            return SignUpResponses.EmailSent
        }
    }
    async function logout(){
        setLoading(true)
        await supabase.auth.signOut()
        setLoading(false)
    }
    function getUserId(){
        if(!session) return null
        return session.user.id
    }

    return (
        <AuthContext.Provider value={{
            session,
            user,
            localUser,
            loading,
            signup,
            login,
            logout,
            getUserId
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}