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
    logOutLoading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<SignUpResponses>
    signInWithGoogle: () =>  Promise<void>
    logout: () => Promise<void>
    getUserId: () => null|string
}
const initialValues: AuthType = {
    session: undefined,
    user: null,
    localUser: null,
    loading: false,
    logOutLoading: false,
    login: async (_: string, _1: string) => {},
    signup: async (_: string, _1: string, _2: string) => Promise.resolve(SignUpResponses.SignUpError),
    signInWithGoogle: async () =>  Promise.resolve(undefined),
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
    const [logOutLoading, setLogOutLoading] = useState(false)
    const protectedPaths = ["/dashboard", "/log", "/create", "/stats", "/goals", "/creategoal", "/settings", "/help", "/studio"]
    const unprotectedPaths = ["/", "/auth"]
    

    const {alert} = useContext(AlertContext)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const {data: authListener} = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log("------------------------------------")
            console.log("Event: " + _event + ", Session: " );
            console.log(session)
            console.log("------------------------------------")
            setSession(session)
        })

        return () => {authListener.subscription.unsubscribe()}
    }, [])
    
    useEffect(() => {
        if(session === undefined) return
        navigateUser(session)
    }, [session])

    async function navigateUser(session: Session | null){
        const currentPath = location.pathname
        if(session === null) {
            unprotectedPaths.includes(currentPath) ? navigate(currentPath) : navigate("/"); 
            return
        }else{
            protectedPaths.includes(currentPath) ? navigate(currentPath) : navigate("/dashboard"); 
        }

        setLoading(true)

        const { data, error} = await supabase.auth.getUser()

        if(error){
            alert(error.message)
            await supabase.auth.signOut()
            navigate("/")
            setLoading(false)
            return
        }

        setUser(data.user)
        await createUserEntryIfMissing(data.user)
        setLoading(false)
    }
    
    async function createUserEntryIfMissing(user: User) {

        const { data, error } = await supabase
            .from("users")
            .upsert([{email: user.email?.toLowerCase(),  name: user.user_metadata.name, user_id: user.id,}], 
            { 
                onConflict: 'email', 
                ignoreDuplicates: false 
            })
            .select("*")
            .single()

        if (error) {
            alert("Upsert error: " + error.message)
            return
        }

        if (data) {
            setLoacalUser(data as UserType)
        }

    }

    async function login(email: string, password: string){
        setLoading(true)
        const {error} = await supabase.auth.signInWithPassword({email, password})

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

    async function signInWithGoogle() {
        setLoading(true)

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
            redirectTo: 'https://habitlink2.netlify.app/dashboard' // or your production URL
            }
        })

        if (error) {
            console.error('Google sign-in error:', error.message)
        } else {
            console.log('Redirecting to Google sign-in...')
        }
    }
    async function logout(){
        setLogOutLoading(true)
        await supabase.auth.signOut()
        navigate("/")
        setLogOutLoading(false)
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
            logOutLoading,
            signup,
            login,
            logout,
            getUserId,
            signInWithGoogle
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}