import { useIsMobile } from "@/components/Hooks/useIsMobile";
import { UserContext } from "@/components/Providers/UserProvider"
import { dateUtils } from "@/utils/dateUtils";
import { AchievementsEnum } from "@/utils/types";
import { useContext } from "react"
import { FaCheck } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { TbTrophy } from "react-icons/tb";

export default function Achievements() {

    const HC = useContext(UserContext)
    const isMobile = useIsMobile()

    return (
        <div className={`${isMobile ? "mb-24 mt-6" : "mt-20"} flex flex-col items-center gap-4 mb-15`}>
            <div className="bg-panel1 outline-1 outline-border rounded-2xl w-[90%] max-w-[600px] p-5 shadow-md shadow-gray-200 dark:shadow-none">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-panel2 text-subtext2  p-1.5 rounded-lg outline-1 outline-border2">
                       <TbTrophy />
                    </div>
                    <p className="text-lg text-title font-semibold leading-none">Achievements</p>
                </div>
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
            <div className="w-[90%] max-w-[600px] flex flex-col gap-4 flex-wrap">
                {Array.from(HC.achievements.values()).map(a => {
                    if(!Object.values(AchievementsEnum).includes(a.id)) return
                    return(
                        <div className={`hover:cursor-default hover:scale-98 transition-all justify-center duration-200 ease-in-out flex-grow shadow-md shadow-gray-200 dark:shadow-none p-4 bg-panel1 ${a.userAchievements.length == 0 ? "outline-border" : "outline-highlight/30 "} rounded-2xl outline-1 flex flex-col gap-3`}>
                            <div className="flex items-center justify-between w-full gap-3">
                                {a.userAchievements.length == 0 ? 
                                <FaLock className="text-subtext3"/> :
                                <FaCheck className="text-highlight" size={25}/>}
                                <div className="flex items-center gap-3 justify-between w-full">
                                    <p className="text-subtext1 text-sm font-medium text-center">
                                        {a.name}
                                    </p>
                                    {a.userAchievements.length == 0 ?
                                    <p className="text-subtext3 text-xs  text-center">
                                        Achievement awaits!
                                    </p>:
                                    <div className="flex flex-col justify-center">
                                        <p className="text-highlight font-medium text-xs  text-center">
                                            Unlocked
                                        </p>
                                        <p className="text-subtext3 text-xs  text-center">
                                            {dateUtils.formatDate(new Date(a.userAchievements[0].created_at))}
                                        </p>
                                    </div>
                                    }
                                </div>
                            </div>
                            {a.description ? 
                            <div>
                                <p className="text-subtext3 text-xs  ">
                                    {a.description}
                                </p>
                            </div> : null}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
