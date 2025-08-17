import { useContext, useRef } from "react"
import { AiOutlineLoading } from "react-icons/ai"
import { UserContext } from "../Providers/UserProvider"

export default function DeleteArchiveGoal() {

    const HC = useContext(UserContext)
    const currentBtn = useRef(0)

    return (
        <div className="flex justify-center gap-3 w-full">
            <button className="rounded-md text-sm font-medium w-full flex justify-center items-center px-5 outline-1 h-7 outline-border2 dark:text-subtext2 text-subtext1 hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out "
                onClick={async () => {
                    currentBtn.current = 1
                    await HC.archiveGoal(HC.currentGaol!)
                    HC.setCurrentGoal(null)
                }}>
                    {HC.loading && currentBtn.current == 1 ? <AiOutlineLoading className="animate-spin"/>  : "Archive"} 
            </button>
            <button className="rounded-md text-sm font-medium w-full flex justify-center items-center  px-5 outline-1 h-7 outline-border2 dark:text-subtext2 text-subtext1 hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out "
                onClick={async () => {
                    currentBtn.current = 2
                    await HC.deleteGoal(HC.currentGaol!)
                    HC.setCurrentGoal(null)
                }}>
                {HC.loading && currentBtn.current == 2 ? <AiOutlineLoading className="animate-spin"/>  : "Delete"} 
            </button>
        </div>
    )
}
