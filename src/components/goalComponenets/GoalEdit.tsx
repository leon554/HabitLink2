import { useState } from "react"
import Model from "../InputComponents/Model"
import DeleteArchiveGoal from "./DeleteArchiveGoal"



export default function GoalEdit() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div>
                <button className="bg-panel1 p-2 px-9 rounded-xl text-subtext3 outline-1  outline-border hover:cursor-pointer hover:bg-panel2  hover:scale-[1.02] transition-all duration-150 ease-in-out"
                    onClick={() => setOpen(true)}>
                        Edit 
                </button>
            </div>
            <Model open={open} onClose={() => setOpen(false)}>
                <div className="max-w-[400px] w-[90%] bg-panel1 rounded-2xl p-6 outline-1 outline-border"
                onClick={e => e.stopPropagation()}>
                    <p className="text-center text-title text-xl">
                        Edit Goal
                    </p>
                    <div className="mt-6">
                        <DeleteArchiveGoal/>
                    </div>
                    <button className="bg-btn w-full mt-6 rounded-xl p-1 text-btn-text hover:cursor-pointer"
                    onClick={() => setOpen(false)}>
                        Exit
                    </button>
                </div>
            </Model>
        </>

    )
}
