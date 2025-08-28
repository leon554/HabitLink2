import { UserContext } from "@/components/Providers/UserProvider"
import { dateUtils } from "@/utils/dateUtils";
import { useContext } from "react"
import { FaCheck } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

export default function Achievements() {

    const HC = useContext(UserContext)
    return (
        <div className="mt-20 flex flex-col items-center gap-4">
            <div className="bg-panel1 outline-1 outline-border rounded-2xl w-[90%] max-w-[600px] p-5 shadow-md shadow-gray-200 dark:shadow-none">
                <p className="text-lg text-title font-medium">
                    Achievements
                </p>
                {HC.isCalculating.current.isLoading() ? 
                <p className="text-sm text-subtext2 animate-pulse">
                    Loading...
                </p>
                :
                <p className="text-sm text-subtext2">
                    Progress: {Math.round((Array.from(HC.achievements.values()).filter(a => a.userAchievements.length >= 1).length/HC.achievements.size)*100)}%
                </p>
                }
            </div>
            <div className="w-[90%] max-w-[600px] flex gap-4 flex-wrap">
                {Array.from(HC.achievements.values()).map(a => {
                    return(
                        <div className={`hover:cursor-default hover:scale-98 transition-all justify-center duration-200 ease-in-out flex-grow shadow-md shadow-gray-200 dark:shadow-none p-4 bg-panel1 ${a.userAchievements.length == 0 ? "outline-border" : "outline-highlight "} rounded-2xl outline-1 flex flex-col items-center gap-3`}>
                            {a.userAchievements.length == 0 ? 
                            <FaLock className="text-subtext3"/> :
                            <FaCheck className="text-highlight"/>}
                            <div className="flex flex-col gap-1">
                                <p className="text-subtext1 text-sm font-medium text-center">
                                    {a.name}
                                </p>
                                {a.userAchievements.length == 0 ? null:
                                    <p className="text-subtext3 text-xs  text-center">
                                        {dateUtils.formatDate(new Date(a.userAchievements[0].created_at))}
                                    </p>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
