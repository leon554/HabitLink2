import { useContext, useRef } from "react"
import { AiOutlineLoading } from "react-icons/ai"
import { UserContext } from "../Providers/UserProvider"
import ButtonComp from "../primatives/ButtonComp"

interface Props{
    noAnimate?: boolean
}
export default function DeleteArchiveGoal({noAnimate}: Props) {

    const HC = useContext(UserContext)
    const currentBtn = useRef(0)

    return (
        <div className="flex justify-center gap-3 w-full">
            <ButtonComp
                name={HC.loading && currentBtn.current == 1 ? <AiOutlineLoading className="animate-spin"/>  : "Archive"} 
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
