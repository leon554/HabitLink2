import { useContext } from "react"
import { UserContext } from "../components/Providers/UserProvider"
import Select from "../components/InputComponents/Select"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"
import GoalProgress from "../components/goalComponenets/GoalProgress"
import CountDown from "../components/goalComponenets/CountDown"


export default function GoalsPage() {

    const HC = useContext(UserContext)

    return (
        <div className="w-full flex justify-center">
            {!HC.currentGaol ?
                <div className="w-[90%] max-w-[600px] mt-20 bg-stone-800 text-stone-300 font-mono rounded-md p-4 flex justify-center flex-col items-center">
                    <p className="text-2xl mb-5 mt-1">
                        Select Goal
                    </p>
                    <div className="flex flex-col items-stretch gap-2 w-full mb-2">
                        {Array.from(HC.goals.values()).map((g, i) => {
                            return(
                                <div key={i} className="grow-1 bg-stone-700/30 rounded-md text-stone-300 flex gap-3 items-center hover:cursor-pointer"
                                    onClick={() => HC.setCurrentGoal(g)}>
                                    <div className="w-3 h-10 bg-green-400 rounded-l-md"></div>
                                    <p>{g.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            :
            <div className="w-full flex flex-col items-center gap-3">
                <div className="w-[90%] max-w-[600px] mt-20 p-10 relative bg-stone-800 text-stone-300 font-mono rounded-md flex justify-center flex-col items-center gap-2">
                    <p className="text-3xl font-semibold">
                        {HC.currentGaol.name}
                    </p>
                    <p className={`text-sm text-stone-400 ${!HC.currentGaol.description ? "absolute" : ""}`}>
                        {HC.currentGaol.description}
                    </p>
                    <div className="text-stone-500 hover:cursor-pointer absolute top-3 right-3">
                        <Select items={Array.from(HC.goals.values())} 
                                                selectedItem={HC.currentGaol} 
                                                setSelectedItem={HC.setCurrentGoal}
                                                setText={HiOutlineSwitchHorizontal}
                                                style="outline-0 p-0 justify-end flex "/>
                    </div>
                </div>
                <CountDown/>
                <GoalProgress/>
            </div>}
        </div>
    )
}
