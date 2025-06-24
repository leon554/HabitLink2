import { useContext } from "react"
import { UserContext } from "../components/Providers/UserProvider"
import InfoPanel from "../components/InfoPanel"
import { AuthContext } from "../components/Providers/AuthProvider"


export default function SettingsPage() {

    const HC = useContext(UserContext)
    const auth = useContext(AuthContext)


    const completions = Array.from(HC.habitsCompletions.values()).reduce((s, a) => s + Array.from(a.values()).length, 0)
    const goalComps = Array.from(HC.goalCompletions.values()).reduce((s, a) => s + Array.from(a.values()).length, 0)

    return (
        <div className="flex flex-col justify-center mt-20 gap-3 items-center">
            <div className="bg-panel1 flex flex-col items-center rounded-2xl w-[90%] max-w-[600px]  p-5 font-mono outline-1 outline-border texture">
                <p className="text-title text-xl">
                    settings 
                </p>
            </div>
            <InfoPanel>
                <InfoPanel.Title title="Acount"/>
                <InfoPanel.BodyContainer>
                    <div className="flex gap-2">
                        <p>
                            Role:
                        </p>
                        <p className="outline-border2 outline-1 dark:outline-0 rounded-xl px-3 bg-btn text-btn-text">
                            {auth.user?.role}
                        </p>
                    </div>
                </InfoPanel.BodyContainer>
            </InfoPanel>
            <InfoPanel>
                <InfoPanel.Title title="Limits"/>
                <InfoPanel.BodyContainer>
                    <InfoPanel.SubText text={`Total Goal Amount${String(Array.from(HC.goals.values()).length).padStart(10, ".")}/10`}/>
                    <InfoPanel.SubText text={`Total Habit Amount${String(Array.from(HC.habits.values()).length).padStart(9, ".")}/10`}/>
                </InfoPanel.BodyContainer>
            </InfoPanel>
            <InfoPanel>
                <InfoPanel.Title title="Usage"/>
                <InfoPanel.BodyContainer>
                    <InfoPanel.SubText text={`Total habit completions${String(completions).padStart(7, ".")}`}/>
                    <InfoPanel.SubText text={`Total goal completions${String(goalComps).padStart(8, ".")}`}/>
                </InfoPanel.BodyContainer>
            </InfoPanel>
        </div>
    )
}
