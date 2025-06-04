import { useContext} from "react";
import Select from "../components/InputComponents/Select";
import { UserContext } from "../components/UserProvider";
import StatsTitle from "../components/StatsTitle";


export default function StatsPage() {

    const HC = useContext(UserContext)


    return (
        <div className="flex justify-center">
            {!HC.currentHabit ?
                <div className="flex mt-30 items-center  flex-col gap-5 rounded-md bg-stone-800 w-[90%] pb-8">
                    <p className="text-3xl font-mono text-center font-semibold text-stone-300 p-5 ">
                        Select a habit to see your stats!
                    </p>
                    <Select habits={Array.from(HC.habits.values())} selectedHabit={HC.currentHabit} setSelectedHabit={HC.setCurrentHabit}/>
                </div>
            : 
            <div className="mt-20 w-full flex justify-center">
                <StatsTitle/>
            </div>
            }
        </div>
    )
}
