import { UserContext } from "../Providers/UserProvider"
import { Util } from "../../utils/util"
import Select from "../InputComponents/Select"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"
import { useContext } from "react"
import { IoFlame } from "react-icons/io5";
import { Origin } from "@/utils/types"

export default function StatsTitle() {

    const HC = useContext(UserContext)

    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none  rounded-2xl outline-1 outline-border bg-panel1 w-full p-4 flex justify-between items-center  ">
            <p className="text-subtext1  text-lg font-semibold flex items-center gap-1 ">
                {HC.habitStats.get(HC.currentHabit?.id ?? 0)?.streak ?? 0}{<IoFlame className="text-amber-500 "/>}
            </p>
            <p className="text-2xl font-semibold text-center  text-title">
                {Util.capitilizeFirst(HC.currentHabit?.name)} 
            </p>
            <div className="text-subtext2 hover:cursor-pointer flex relative">
                <Select items={Array.from(HC.habits.values())} 
                                        selectedItem={HC.currentHabit} 
                                        setSelectedItem={(id: number) => HC.setCurrentHabit(HC.habits.get(id) ?? null)}
                                        setText={<HiOutlineSwitchHorizontal/>}
                                        style="outline-0 p-0 justify-end flex "
                                        origin={Origin.topRight}/>
            </div>
        </div>
    )
}
