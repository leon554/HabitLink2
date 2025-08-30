import { useContext } from "react";
import { IoInformationCircleOutline } from "react-icons/io5"
import { TbNotebook } from "react-icons/tb";
import { UserContext } from "../Providers/UserProvider";
import { dateUtils } from "@/utils/dateUtils";
import { AlertContext } from "../Alert/AlertProvider";

interface Props{
    habitId: number
}
export default function Notes({habitId} : Props) {

    const HC = useContext(UserContext)
    const {alert} = useContext(AlertContext)
    const entries = (HC.habitsCompletions.get(habitId) ?? []).filter(e => e.notes != "" && e.notes !== null)

    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none w-full bg-panel1  rounded-2xl outline-1 outline-border relative text-title justify-center p-7 pt-6 pb-7 flex flex-col items-center gap-4 ">
            <div className="w-full flex items-center mb-2 justify-between">
                    <div className="flex items-center gap-4">
                    <div className="shadow-sm shadow-gray-200 dark:shadow-none bg-panel2 text-subtext2 outline-1 outline-border2 p-1.5 rounded-lg">
                        <TbNotebook />
                    </div>
                    <p className="text-title font-semibold leading-none pb-1">
                        Notes
                    </p>
                </div>
                <IoInformationCircleOutline size={14} color="#57534E" className="hover:cursor-pointer " onClick={() => {
                    alert("To add notes to a habit, click the three vertical dots next to that habit on the log page, then select ‘Add Notes’ from the dropdown.")
                }}/>
            </div>
            <div className="w-full">
                {entries.length == 0 ? 
                    <p className="bg-panel2 rounded-xl border-border2 border-1 w-full text-center text-sm text-subtext2 py-2 hover:cursor-default">
                        ✨ Your notes will show up here ✨
                    </p> 
                :
                <div className="flex flex-col gap-2 max-h-[250px] overflow-y-scroll no-scrollbar rounded-xl">
                    {entries.sort((a, b) => b.date - a.date).map(e => {
                        return(
                            <div className="bg-panel2 rounded-xl border-border2 border-1 w-full p-2 px-3  pb-[1px] flex flex-col justify-center">
                                <p className="text-xs text-btn-text bg-btn w-fit px-2 rounded-full mt-1.5">
                                    {dateUtils.formatDate(new Date(e.created_at))}
                                </p>
                                <p className=" text-sm text-subtext2 py-2 hover:cursor-default">
                                    {e.notes}
                                </p> 
                            </div>
                        )
                    })}
                </div>}
            </div>
        </div>
    )
}
