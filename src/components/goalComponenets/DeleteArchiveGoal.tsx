import { useContext, useEffect, useRef } from "react"
import { AiOutlineLoading } from "react-icons/ai"
import { UserContext } from "../Providers/UserProvider"
import ButtonComp from "../primatives/ButtonComp"
import { AlertContext } from "../Alert/AlertProvider"
import { AuthContext } from "../Providers/AuthProvider"

interface Props{
    noAnimate?: boolean
}
export default function DeleteArchiveGoal({noAnimate}: Props) {

    const HC = useContext(UserContext)
    const auth = useContext(AuthContext)
    const {alert} = useContext(AlertContext)
    const goal = HC.goals.get(HC.currentGaol ?? 0)
    const currentBtn = useRef(0)

    useEffect(() => {
        if(goal === undefined && !HC.isCalculating.current.isLoading() && !HC.loading && !auth.loading){
            alert("Goal undefined refresh page")
        }

    }, [goal])

    return (
        <div className="flex justify-center gap-3 w-full">
            <ButtonComp
                name={HC.loading && currentBtn.current == 1 ? <AiOutlineLoading className="animate-spin"/>  : goal?.archived ? "Un-Archive" : "Archive"} 
                onSubmit={async () => {
                    currentBtn.current = 1
                    await HC.archiveGoal(HC.currentGaol!)
                    HC.setCurrentGoal(null)
                }}
                highlight={false}
                short={true}
                style="w-full"
                noAnimation={noAnimate}/>
            <ButtonComp
                name={HC.loading && currentBtn.current == 2 ? <AiOutlineLoading className="animate-spin"/>  : "Delete"} 
                onSubmit={async () => {
                    currentBtn.current = 2
                    await HC.deleteGoal(HC.currentGaol!)
                    HC.setCurrentGoal(null)
                }}
                highlight={false}
                style="w-full"
                short={true}
                noAnimation={noAnimate}/>
        </div>
    )
}
