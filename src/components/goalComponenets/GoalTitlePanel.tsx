import { useContext } from 'react'
import { UserContext } from '../Providers/UserProvider'
import Select from '../InputComponents/Select'
import { HiOutlineSwitchHorizontal } from 'react-icons/hi'
import { Origin } from '@/utils/types'

export default function GoalTitlePanel() {

    const HC = useContext(UserContext)

    return (
        <div className="w-[90%] max-w-[600px] mt-20 p-10 z-10  drop-shadow-sm bg-panel1 text-title  outline-border outline-1 rounded-2xl flex justify-center flex-col items-center gap-2">
            <p className="text-3xl font-semibold text-center">
                {HC.currentGaol!.name}
            </p>
            <p className={`text-sm text-subtext2 text-center ${!HC.currentGaol!.description ? "absolute" : ""}`}>
                {HC.currentGaol!.description}
            </p>
            <div className="text-subtext2 hover:cursor-pointer absolute top-3 right-3">
                <Select items={Array.from(HC.goals.values()).filter(g => !g.archived).map(h =>({name: h.name, id: h.id}))} 
                                        selectedItem={{name: HC.currentGaol!.name, id: HC.currentGaol!.id}}
                                        setSelectedItem={(id: number) => HC.setCurrentGoal(HC.goals.get(id) ?? null)}
                                        setText={<HiOutlineSwitchHorizontal/>}
                                        style="outline-0 p-0 justify-end flex"
                                        origin={Origin.topRight}/>
            </div>
        </div>
    )
}
