import { useState } from "react"
import Create from "../components/Create"
import CreateGoal from "../components/CreateGoal"

export enum State{
    newHabit,
    newGoal,
    choose
}
export default function CreatePage() {
    const [state, setState] = useState<State>(State.choose)
    return (
        <div className="flex justify-center mb-5">
            {state == State.choose ? 
                <div className="mt-20 bg-stone-800 rounded-md gap-2 pb-10 p-5 text-stone-200 font-mono w-[90%] max-w-[600px] flex flex-col items-center">
                    <p className="text-xl mb-4">
                        Create New
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-green-400 p-1 w-40 rounded-md text-stone-800 hover:cursor-pointer hover:bg-green-400/90 transition duration-200 ease-out " 
                            onClick={() => setState(State.newHabit)}>
                            Habit
                        </button>
                        <button className="bg-green-400 p-1 w-40 rounded-md text-stone-800 hover:cursor-pointer hover:bg-green-400/90 transition duration-200 ease-out "
                        onClick={() => setState(State.newGoal)}>
                            Goal
                        </button>
                    </div>

                </div> :
            state == State.newHabit ?
                <Create setState={setState}/>:
                <CreateGoal setState={setState}/>}
        </div>
    )
}
