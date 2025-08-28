import { useContext } from 'react'
import { UserContext } from '../Providers/UserProvider'
import Select from '../InputComponents/Select'
import { HiOutlineSwitchHorizontal } from 'react-icons/hi'
import { Origin } from '@/utils/types'
import { Util } from '@/utils/util'

export default function GoalTitlePanel() {

    const HC = useContext(UserContext)

    return (
        <div className="w-[90%] max-w-[600px] p-5 z-10 relative shadow-md shadow-gray-200 dark:shadow-none bg-panel1 text-title  outline-border outline-1 rounded-2xl flex justify-center flex-col items-center gap-2">
            <p className="text-2xl font-semibold text-center">
                {Util.capitilizeFirst(HC.goals.get(HC.currentGaol!)?.name)}
            </p>
            <p className={`text-xs text-subtext2 text-center max-w-[90%]${!HC.getCurrentGoal()?.description ? "absolute" : ""}`}>
                {HC.getCurrentGoal()?.description}
            </p>
            <div className="text-subtext2 hover:cursor-pointer absolute top-3 right-3">
                <Select items={[...Array.from(HC.goals.values()).filter(g => !g.archived).map(h =>({name: h.name, id: h.id})), {name: "Home", id: -1}]} 
                                        selectedItem={{name: HC.getCurrentGoal()?.name ?? "Loading...", id: HC.getCurrentGoal()?.id ?? 0}}
                                        setSelectedItem={(id: number) => {
                                            id == -1 ? 
                                                HC.setCurrentGoal(null):
                                                HC.setCurrentGoal(id)
                                        }}
                                        setText={<HiOutlineSwitchHorizontal/>}
                                        style="outline-0 p-0 justify-end flex"
                                        origin={Origin.topRight}/>
            </div>
        </div>
    )
}
