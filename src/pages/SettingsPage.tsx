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
            <div className="bg-panel1 flex flex-col items-center rounded-2xl w-[90%] max-w-[600px]  p-5 outline-1 outline-border texture">
                <p className="text-title text-xl font-semibold">
                    Settings 
                </p>
            </div>
            <InfoPanel>
                <InfoPanel.Title title="Acount"/>
                <InfoPanel.BodyContainer>
                    <InfoPanel.BubbleText text="Status:" bubbleText={`${auth.user?.role}`} mb={4}/>
                    <InfoPanel.BubbleText text="Tier:" bubbleText={`${auth.localUser?.role}`} mb={0}/>
                    <InfoPanel.SubText text={`Acount created: ${auth.user?.created_at}`}/>
                </InfoPanel.BodyContainer>
            </InfoPanel>
            <InfoPanel>
                <InfoPanel.Title title="Limits"/>
                <InfoPanel.BodyContainer>
                    <InfoPanel.SubText text={`Total Goal Amount${String(Array.from(HC.goals.values()).length).padStart(15, "_")}/10`}/>
                    <InfoPanel.SubText text={`Total Habit Amount${String(Array.from(HC.habits.values()).length).padStart(14, "_")}/10`}/>
                    <InfoPanel.SubText text={`Total habit completions${String(completions).padStart(11, "_")}/5000`}/>
                    <InfoPanel.SubText text={`Total goal completions${String(goalComps).padStart(11, "_")}/1000`}/>
                </InfoPanel.BodyContainer>
            </InfoPanel>

        </div>
    )
}
