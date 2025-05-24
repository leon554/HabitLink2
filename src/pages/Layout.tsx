import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert/Alert";
import { useContext, useEffect } from "react";
import { SessionContex } from "../components/Session/SessionProvider";
import { supabase } from "../supabase-client";


export default function Layout() {

    const sessionCon = useContext(SessionContex)
    const navigate = useNavigate()

    const fetchSession = async () => {
        const currentSession = await supabase.auth.getSession()
        sessionCon.setSession(currentSession.data.session)
    }
    useEffect(() => {
        fetchSession()
        const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
            sessionCon.setSession(session)
            if(session) {navigate("/dashboard"); return}
            navigate("/")
        })
        return () => {
        authListener.subscription.unsubscribe()
        }
    }, [])
    return (
        <>
            <Alert/>
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </>
    )
}
