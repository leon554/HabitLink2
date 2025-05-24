import type { Session } from "@supabase/supabase-js";
import { createContext, useState } from "react";


interface SessionType{
    session: Session| null
    setSession: (session: Session|null) => void
}
const initialValues: SessionType = {
    session: null,
    setSession: () => null
}

export const SessionContex = createContext<SessionType>(initialValues)

interface Props {
  children: React.ReactNode;
}

export default function SessionProvider(props: Props) {
    const [session, setSession] = useState<null|Session>(null)

    return (
        <SessionContex.Provider value={{
            session,
            setSession
        }}>
            {props.children}
        </SessionContex.Provider>
    )
}