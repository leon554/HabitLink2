import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { AiOutlineLoading } from "react-icons/ai"

export default function GoalCompletionPanel() {
    const HC = useContext(UserContext)

    return (
        <div className="bg-panel1 w-[90%] max-w-[600px] rounded-2xl p-5 flex flex-col  gap-5 justify-center  text-title drop-shadow-md outline-1 outline-border">
            <p className="text-center">
                🎉 Congratulations! You've completed your goal — amazing work and well done! 💪
            </p>
            <div className="flex justify-center gap-3">
                <button className="rounded-xl flex justify-center items-center px-5 outline-1 h-7 outline-border2 dark:text-subtext2 text-subtext1 hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out w-25"
                    onClick={async () => {
                        await HC.archiveGoal(HC.currentGaol!.id)
                        HC.setCurrentGoal(null)
                    }}>
                        {HC.loading ? <AiOutlineLoading className="animate-spin"/>  : "Archive"} 
                </button>
                <button className="rounded-xl flex justify-center items-center  px-5 outline-1 h-7 outline-border2 dark:text-subtext2 text-subtext1 hover:cursor-pointer hover:bg-panel2 transition-colors duration-150 ease-in-out w-25"
                    onClick={async () => {
                        await HC.deleteGoal(HC.currentGaol!.id)
                        HC.setCurrentGoal(null)
                    }}>
                    {HC.loading ? <AiOutlineLoading className="animate-spin"/>  : "Delete"} 
                </button>
            </div>
        </div>
    )
}
